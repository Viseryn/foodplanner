<?php namespace App\Controller;

use App\Mapper\ImageMapper;
use App\Repository\ImageRepository;
use App\Repository\InstallationStatusRepository;
use App\Repository\RecipeRepository;
use App\Service\Files\DirectoryParser;
use App\Service\RecipeControllerService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ImageMigrationController extends AbstractController
{
    use DirectoryParser;

    private string $uploadDirectory;

    public function __construct(
        private readonly ImageMapper $imageMapper,
        private readonly ImageRepository $imageRepository,
        private readonly InstallationStatusRepository $installationStatusRepository,
        private readonly RecipeControllerService $recipeControllerService,
        private readonly RecipeRepository $recipeRepository,
        private readonly string $targetDirectory,
    ) {
        $this->uploadDirectory = $this->getUploadDirectory($this->targetDirectory, '/img/recipes/', true);
    }

    /**
     * ImageMigration API
     *
     * This API can be used **after upgrading to v1.6** to automatically
     *     - remove unused recipe images;
     *     - rename recipe images to new format;
     *     - generate thumbnails for recipe images.
     * After this API has been called and the procedure finished, a flag will be saved to the InstallationStatus
     * of the app and further calls will receive an Error 403.
     */
    #[Route('/api/image-migration', name: 'api_image_migration')]
    public function imageMigration(): Response
    {
        $installationStatus = $this->installationStatusRepository->find(1);
        if ($installationStatus->isUpdateV16() === true) {
            return (new Response)->setStatusCode(403);
        }

        $allImages = $this->getAllImages();
        $usedImages = $this->getUsedImages();
        $unusedImages = $this->getUnusedImages($allImages, $usedImages);

        $this->destroyAllUnusedImageObjects($unusedImages);
        $this->updateAllRecipes($usedImages);
        $this->destroyAllUnusedImageFiles();

        $installationStatus->setUpdateV16(true);
        $this->installationStatusRepository->save($installationStatus, true);
        return new Response;
    }

    private function getAllImages(): ArrayCollection
    {
        return new ArrayCollection($this->imageRepository->findAll());
    }

    private function getUsedImages(): ArrayCollection
    {
        $usedImages = new ArrayCollection;
        $recipes = $this->recipeRepository->findBy([], ['image' => 'ASC']);

        foreach ($recipes as $recipe) {
            if ($recipe->getImage() != null) {
                $usedImages->add($recipe->getImage());
            }
        }
        return $usedImages;
    }

    private function getUnusedImages(ArrayCollection $allImages, ArrayCollection $usedImages): ArrayCollection
    {
        return $allImages->filter(fn ($image) => !$usedImages->contains($image));
    }

    private function destroyAllUnusedImageObjects(ArrayCollection $unusedImages): void
    {
        foreach ($unusedImages as $image) {
            if (file_exists($this->uploadDirectory . $image->getFilename())) {
                unlink($this->uploadDirectory . $image->getFilename());
            }
            $this->imageRepository->remove($image, true);
        }
    }

    private function updateAllRecipes(ArrayCollection $usedImages): void
    {
        // Create ImageDTOs
        $imageDtos = $usedImages->map(fn ($image) => $this->imageMapper->entityToDto($image));
        foreach ($imageDtos as $dto) {
            $dto->setImageContents(base64_encode(file_get_contents($this->uploadDirectory . $dto->getFilename())));
        }

        // Update recipes and generate thumbnails
        $recipes = $this->recipeRepository->findAll();
        foreach ($recipes as $recipe) {
            $dto = $imageDtos->filter(fn ($dto) => $dto->getId() == $recipe->getImage()->getId())->first();
            $this->recipeControllerService->updateRecipeImage($recipe, $dto);
            $this->recipeRepository->save($recipe, true);
        }
    }

    private function destroyAllUnusedImageFiles(): void
    {
        // Find all images in filesystem that are not used by any Image object
        $allImages = $this->getAllImages();
        $allImagesInFilesystem = new ArrayCollection(scandir($this->uploadDirectory));
        $allImagesInFilesystem->remove(1); // Directory ../
        $allImagesInFilesystem->remove(0); // Directory ./
        $unusedImageFiles = $allImagesInFilesystem->filter(
            fn ($file) => !$allImages->map(fn ($image) => $image->getFilename())->contains($file),
        );

        // Destroy all unused image files
        foreach ($unusedImageFiles as $file) {
            unlink($this->uploadDirectory . $file);
        }
    }
}
