<?php namespace App\DataTransferObject;

use App\Entity\Meal;

class MealDTO implements DataTransferObject
{
    private ?int $id;
    private ?RecipeDTO $recipe;
    private ?MealCategoryDTO $mealCategory;
    private ?UserGroupDTO $userGroup;

    public function __construct(Meal $meal)
    {
        $this->id = $meal->getId();
        $this->recipe = new RecipeDTO($meal->getRecipe());
        $this->mealCategory = new MealCategoryDTO($meal->getMealCategory());
        $this->userGroup = new UserGroupDTO($meal->getUserGroup());
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRecipe(): ?RecipeDTO
    {
        return $this->recipe;
    }

    public function getMealCategory(): ?MealCategoryDTO
    {
        return $this->mealCategory;
    }

    public function getUserGroup(): ?UserGroupDTO
    {
        return $this->userGroup;
    }
}
