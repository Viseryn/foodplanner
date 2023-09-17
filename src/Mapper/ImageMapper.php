<?php namespace App\Mapper;

use App\DataTransferObject\ImageDTO;
use App\Entity\File;

/**
 * @implements Mapper<File>
 */
final class ImageMapper implements Mapper
{
    /**
     * @param ImageDTO|null $dto
     * @return File|null
     */
    public function dtoToEntity($dto): ?File
    {
        if ($dto === null) {
            return null;
        }

        return (new File)->setFilename($dto->getFilename())
                         ->setDirectory($dto->getDirectory())
                         ->setPublic($dto->getPublic());
    }

    /**
     * @param File|null $entity
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
