<?php namespace App\Mapper;

use App\DataTransferObject\MealCategoryDTO;
use App\Entity\MealCategory;

/**
 * @implements Mapper<MealCategory>
 */
final class MealCategoryMapper implements Mapper
{
    /**
     * @param MealCategoryDTO $dto
     * @return MealCategory
     */
    public function dtoToEntity($dto): MealCategory
    {
        return (new MealCategory)->setName($dto->getName())
                                 ->setIcon($dto->getIcon());
    }

    /**
     * @param MealCategory $entity
     * @return MealCategoryDTO
     */
    public function entityToDto($entity): MealCategoryDTO
    {
        return (new MealCategoryDTO)->setId($entity->getId())
                                    ->setName($entity->getName())
                                    ->setIcon($entity->getIcon());
    }
}
