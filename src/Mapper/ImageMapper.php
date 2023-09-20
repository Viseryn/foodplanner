<?php namespace App\Mapper;

use App\DataTransferObject\ImageDTO;
use App\Entity\Image;
use App\Service\Files\DirectoryParser;
use App\Service\Files\SafeFilenameCreator;

/**
 * @implements Mapper<Image>
 */
final class ImageMapper implements Mapper
{
    use DirectoryParser;
    use SafeFilenameCreator;

    /**
     * @param ImageDTO|null $dto
     * @return Image|null
     */
    public function dtoToEntity($dto): ?Image
    {
        if ($dto === null) {
            return null;
        }

        $filename = $this->getSafeFilenameOf($dto->getFilename());
        $directory = $this->parseDirectory($dto->getDirectory());

        return (new Image)->setFilename($filename)
                          ->setDirectory($directory)
                          ->setPublic($dto->getPublic());
    }

    /**
     * @param Image|null $entity
     * @return ImageDTO|null
     */
    public function entityToDto($entity): ?ImageDTO
    {
        if ($entity === null) {
            return null;
        }

        return (new ImageDto)->setId($entity->getId())
                             ->setFilename($entity->getFilename())
                             ->setDirectory($entity->getDirectory())
                             ->setPublic($entity->isPublic());
    }
}
