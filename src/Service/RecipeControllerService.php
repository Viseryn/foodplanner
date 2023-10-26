<?php namespace App\Service;

use App\DataTransferObject\ImageDTO;
use App\DataTransferObject\RecipeDTO;
use App\Entity\Recipe;
use App\Mapper\Mapper;
use App\Mapper\MapperFactory;
use App\Repository\MealRepository;
use App\Repository\RecipeRepository;
use App\Service\Files\RecipeImageManager;
use App\Service\Files\ThumbnailManager;
use Doctrine\Common\Collections\ArrayCollection;

class RecipeControllerService
{
    private Mapper $mapper;

    public function __construct(
        private readonly MapperFactory $mapperFactory,
        private readonly MealRepository $mealRepository,
        private readonly RecipeImageManager $recipeImageManager,
        private readonly RecipeRepository $recipeRepository,
        private readonly ThumbnailManager $thumbnailManager,
    ) {
        $this->mapper = $this->mapperFactory::getMapperFor(Recipe::class);
    }

    /**
     * @return ArrayCollection<RecipeDTO>
     */
    public function getAllRecipes(): ArrayCollection
    {
        return (new ArrayCollection(
            $this->recipeRepository->findBy([], ['title' => 'ASC']),
        ))->map(fn ($recipe) => $this->mapper->entityToDto($recipe));
    }

    public function removeRecipe(Recipe $recipe): void
    {
        $meals = $this->mealRepository->findBy(['recipe' => $recipe->getId()]);
        foreach ($meals as $meal) {
            $this->mealRepository->remove($meal, true);
        }

        $image = $recipe->getImage();
        if ($image != null) {
            $recipe->setImage(null);
            $this->recipeImageManager->remove($image);
        }

        $this->recipeRepository->remove($recipe, true);
    }

    public function updateRecipeImage(Recipe $recipe, ImageDTO $imageDto): void
    {
        $isImageDtoChange = $imageDto->getImageContents() != null || $imageDto->getRemoveImage();
        $oldRecipeImage = $recipe->getImage();

        if ($oldRecipeImage != null && $isImageDtoChange) {
            $recipe->setImage(null);
            $this->recipeImageManager->remove($oldRecipeImage);
        }

        if ($imageDto->getImageContents() != null) {
            $image = $this->recipeImageManager->upload($imageDto);
            $this->thumbnailManager->upload($imageDto);
            $recipe->setImage($image);
        }
    }
}
