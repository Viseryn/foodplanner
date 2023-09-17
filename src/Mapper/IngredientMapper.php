<?php namespace App\Mapper;

use App\DataTransferObject\IngredientDTO;
use App\Entity\Ingredient;

/**
 * @implements Mapper<Ingredient>
 */
final class IngredientMapper implements Mapper
{
    /**
     * @param IngredientDTO $dto
     * @return Ingredient
     */
    public function dtoToEntity($dto): Ingredient
    {
        return (new Ingredient)->setName($dto->getName())
                               ->setQuantityValue($dto->getQuantityValue())
                               ->setQuantityUnit($dto->getQuantityUnit())
                               ->setPosition($dto->getPosition())
                               ->setChecked($dto->getChecked());
    }

    /**
     * @param Ingredient $entity
     * @return IngredientDTO
     */
    public function entityToDto($entity): IngredientDTO
    {
        return (new IngredientDTO)->setId($entity->getId())
                                  ->setName($entity->getName())
                                  ->setQuantityValue($entity->getQuantityValue())
                                  ->setQuantityUnit($entity->getQuantityUnit())
                                  ->setPosition($entity->getPosition())
                                  ->setChecked($entity->isChecked());
    }
}
