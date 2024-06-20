<?php namespace App\Mapper;

use App\DataTransferObject\AddMealRequestDto;
use App\Entity\Meal;
use App\Repository\DayRepository;
use App\Repository\MealCategoryRepository;
use App\Repository\RecipeRepository;
use App\Repository\UserGroupRepository;

/**
 * @implements Mapper<Meal>
 */
final class AddMealRequestMapper implements Mapper {

    public function __construct(
        private readonly DayRepository $dayRepository,
        private readonly MealCategoryRepository $mealCategoryRepository,
        private readonly RecipeRepository $recipeRepository,
        private readonly UserGroupRepository $groupRepository,
    ) {}

    /**
     * @param AddMealRequestDto $dto
     * @return Meal
     */
    public function dtoToEntity($dto): Meal {
        return (new Meal())->setDay($this->dayRepository->find($dto->getDay()))
                           ->setMealCategory($this->mealCategoryRepository->find($dto->getMealCategory()))
                           ->setUserGroup($this->groupRepository->find($dto->getUserGroup()))
                           ->setRecipe($this->recipeRepository->find($dto->getRecipe()));
    }

    /**
     * @param Meal $entity
     * @return AddMealRequestDto
     */
    public function entityToDto($entity): AddMealRequestDto {
        return new AddMealRequestDto;
    }
}
