<?php

namespace App\Service\Files;

use App\Entity\Image;
use App\Repository\ImageRepository;

final class ThumbnailManager implements ImageManager {
    use Base64Decoder;
    use DirectoryParser;

    public function __construct(
        private readonly ImageRepository $imageRepository,
        private readonly string $targetDirectory,
    ) {
        // $targetDirectory is injected via config/services.yaml
    }

    public function upload(Image $image): ?Image {
        $this->createThumbnailOf($image);

        $thumbnail = clone $image;
        $thumbnail->setFilename('THUMBNAIL__' . $image->getFilename());
        $this->imageRepository->save($thumbnail, true);

        return $thumbnail;
    }

    private function createThumbnailOf(Image $image, int $width = 550): void {
        $imageContents = imagecreatefromstring(
            file_get_contents(
                $this->getUploadDirectory(
                    $this->targetDirectory,
                    $image->getDirectory(),
                    $image->isPublic(),
                ) . $image->getFilename(),
            ),
        );
        $imageWidth = imagesx($imageContents);
        $imageHeight = imagesy($imageContents);
        $height = floor($imageHeight * ($width / $imageWidth)); // height for thumbnail based on width argument

        $thumbnailContents = imagecreatetruecolor($width, $height);
        imagecopyresampled($thumbnailContents, $imageContents, 0, 0, 0, 0, $width, $height, $imageWidth, $imageHeight);
        imagewebp(
            $thumbnailContents, $this->getUploadDirectory(
                $this->targetDirectory,
                $image->getDirectory(),
                $image->isPublic(),
            ) . 'THUMBNAIL__' . $image->getFilename(),
        );

        imagedestroy($imageContents);
        imagedestroy($thumbnailContents);
    }

    public function remove(Image $image): void {
        $directory = $this->getUploadDirectory(
            $this->targetDirectory,
            $image->getDirectory(),
            $image->isPublic(),
        );
        $filename = $image->getFilename();

        unlink($directory . $filename);
        $this->imageRepository->remove($image, true);
    }
}
