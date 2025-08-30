<?php

namespace App\Service\Files;

use App\Entity\Image;
use App\Repository\ImageRepository;
use InvalidArgumentException;
use Symfony\Component\String\Slugger\SluggerInterface;

final class RecipeImageManager implements ImageManager {
    use Base64Decoder;
    use DirectoryParser;
    use SafeFilenameCreator;

    private const ALLOWED_EXTENSIONS = ['png', 'gif', 'jpg', 'jpeg', 'webp'];

    public function __construct(
        private readonly string $targetDirectory,
        private readonly ImageRepository $imageRepository,
        private readonly ThumbnailManager $thumbnailManager,
        private readonly SluggerInterface $slugger,
    ) {
        // $targetDirectory is injected via config/services.yaml
    }

    public function upload(Image $image): ?Image {
        if (!$this->isBase64Image($image->getImageContents())) {
            throw new InvalidArgumentException("Argument is not a valid image.");
        }

        $filename = $this->getSafeFilenameOf($image->getFilename());
        $directory = $this->parseDirectory($image->getDirectory());

        $file = (new Image)
            ->setFilename($filename)
            ->setDirectory($directory)
            ->setPublic($image->isPublic());

        $uploadDirectory = $this->getUploadDirectory($this->targetDirectory, $directory, $file->isPublic());

        $filePut = file_put_contents(
            $uploadDirectory . $filename,
            $this->decodeBase64($image->getImageContents()),
        );

        if ($filePut === false) {
            return null;
        }

        $this->imageRepository->save($file, true);

        $this->thumbnailManager->upload($file);

        return $file;
    }

    private function isBase64Image(string $file): bool {
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
     *
     * @param Image $image
     * @return void
     */
    public function remove(Image $image): void {
        $directory = $this->getUploadDirectory(
            $this->targetDirectory,
            $image->getDirectory(),
            $image->isPublic(),
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
