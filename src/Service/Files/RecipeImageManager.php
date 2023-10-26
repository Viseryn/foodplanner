<?php namespace App\Service\Files;

use App\DataTransferObject\ImageDTO;
use App\Entity\Image;
use App\Mapper\Mapper;
use App\Mapper\MapperFactory;
use App\Repository\ImageRepository;
use InvalidArgumentException;

final class RecipeImageManager implements ImageManager
{
    use Base64Decoder;
    use DirectoryParser;

    private const ALLOWED_EXTENSIONS = ['png', 'gif', 'jpg', 'jpeg', 'webp'];

    /** @var Mapper<Image> */
    private readonly Mapper $mapper;

    public function __construct(
        private readonly ImageRepository $imageRepository,
        private readonly string $targetDirectory,
        private readonly ThumbnailManager $thumbnailManager,
    ) {
        // $targetDirectory is injected via config/services.yaml
        $this->mapper = MapperFactory::getMapperFor(Image::class);
    }

    public function upload(ImageDTO $imageDto): ?Image
    {
        if (!$this->isImage($imageDto->getImageContents())) {
            throw new InvalidArgumentException('Argument is not a valid image.');
        }

        $file = $this->mapper->dtoToEntity($imageDto);

        $filename = $file->getFilename();
        $uploadDirectory = $this->getUploadDirectory(
            $this->targetDirectory,
            $file->getDirectory(),
            $file->isPublic(),
        );

        $filePut = file_put_contents(
            $uploadDirectory . $filename,
            $this->decodeBase64($imageDto->getImageContents()),
        );
        if ($filePut === false) {
            return null;
        }

        $this->imageRepository->add($file, true);
        return $file;
    }

    private function isImage(string $file): bool
    {
        $fileContents = $this->decodeBase64($file);
        if ($fileContents === false) {
            return false;
        }

        // TODO [Issue #135]: Check extension
        return true;
    }

    /**
     * Removes an Image from the database and the filesystem. If the image has a corresponding thumbnail,
     * it will also be removed from the database and the filesystem.
     * @param Image $image
     * @return void
     */
    public function remove(Image $image): void
    {
        $directory = $this->getUploadDirectory(
            $this->targetDirectory,
            $image->getDirectory(),
            $image->isPublic()
        );
        $filename = $image->getFilename();
        unlink($directory . $filename);

        $thumbnail = $this->imageRepository->findOneByFilename('THUMBNAIL__' . $filename);
        if ($thumbnail != null) {
            $this->thumbnailManager->remove($thumbnail);
        }

        $this->imageRepository->remove($image, true);
    }
}
