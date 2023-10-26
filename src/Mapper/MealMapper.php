<?php namespace App\Mapper;

use App\DataTransferObject\MealDTO;
use App\Entity\Meal;

/**
 * @implements Mapper<Meal>
 */
final class MealMapper implements Mapper
{
    public function __construct(
        private readonly MealCategoryMapper $mealCategoryMapper,
        private readonly RecipeMapper $recipeMapper,
        private readonly UserGroupMapper $userGroupMapper,
    ) {
    }

    /**
     * @param MealDTO $dto
     * @return Meal
     */
    public function dtoToEntity($dto): Meal
    {
        return (new Meal)->setRecipe($this->recipeMapper->dtoToEntity($dto->getRecipe()))
                         ->setMealCategory($this->mealCategoryMapper->dtoToEntity($dto->getMealCategory()))
                         ->setUserGroup($this->userGroupMapper->dtoToEntity($dto->getUserGroup()));
    }

    /**
     * @param Meal $entity
     * @return MealDTO
     */
    public function entityToDto($entity): MealDTO
    {
        return (new MealDTO)->setId($entity->getId())
                            ->setRecipe($this->recipeMapper->entityToDto($entity->getRecipe()))
                            ->setMealCategory($this->mealCategoryMapper->entityToDto($entity->getMealCategory()))
                            ->setUserGroup($this->userGroupMapper->entityToDto($entity->getUserGroup()));
    }
}
