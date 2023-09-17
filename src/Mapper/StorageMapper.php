<?php namespace App\Mapper;

use App\DataTransferObject\StorageDTO;
use App\Entity\Storage;

/**
 * @implements Mapper<Storage>
 */
final class StorageMapper implements Mapper
{
    public function __construct(
        private readonly IngredientMapper $ingredientMapper,
    ) {
    }

    /**
     * @param StorageDTO $dto
     * @return Storage
     */
    public function dtoToEntity($dto): Storage
    {
        $storage = (new Storage)->setName($dto->getName());
        foreach ($dto->getIngredients() as $ingredientDto) {
            $storage->addIngredient($this->ingredientMapper->dtoToEntity($ingredientDto));
        }

        return $storage;
    }

    /**
     * @param Storage $entity
     * @return StorageDTO
     */
    public function entityToDto($entity): StorageDTO
    {
        return (new StorageDto)->setId($entity->getId())
                               ->setName($entity->getName())
                               ->setIngredients($entity->getIngredients());
    }
}
