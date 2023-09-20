<?php namespace App\Service\Files;

use App\DataTransferObject\ImageDTO;
use App\Entity\Image;
use App\Mapper\Mapper;
use App\Mapper\MapperFactory;
use App\Repository\ImageRepository;

final class ThumbnailManager implements ImageManager
{
    use Base64Decoder;
    use DirectoryParser;

    /** @var Mapper<Image> */
    private readonly Mapper $mapper;

    public function __construct(
        private readonly ImageRepository $imageRepository,
        private readonly string $targetDirectory,
    ) {
        // $targetDirectory is injected via config/services.yaml
        $this->mapper = MapperFactory::getMapperFor(Image::class);
    }

    public function upload(ImageDTO $imageDto): ?Image
    {
        $image = $this->mapper->dtoToEntity($imageDto);
        $this->createThumbnailOf($image);

        $thumbnail = clone $image;
        $thumbnail->setFilename('THUMBNAIL__' . $image->getFilename());
        $this->imageRepository->add($thumbnail, true);

        return $thumbnail;
    }

    private function createThumbnailOf(Image $image, int $width = 350): void
    {
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

    public function remove(Image $image): void
    {
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
