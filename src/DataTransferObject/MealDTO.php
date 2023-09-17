<?php namespace App\DataTransferObject;

/**
 * @implements DataTransferObject<Meal>
 */
class MealDTO implements DataTransferObject
{
    private ?int $id = null;
    private ?RecipeDTO $recipe = null;
    private ?MealCategoryDTO $mealCategory = null;
    private ?UserGroupDTO $userGroup = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getRecipe(): ?RecipeDTO
    {
        return $this->recipe;
    }

    public function setRecipe(?RecipeDTO $recipe): self
    {
        $this->recipe = $recipe;
        return $this;
    }

    public function getMealCategory(): ?MealCategoryDTO
    {
        return $this->mealCategory;
    }

    public function setMealCategory(?MealCategoryDTO $mealCategory): self
    {
        $this->mealCategory = $mealCategory;
        return $this;
    }

    public function getUserGroup(): ?UserGroupDTO
    {
        return $this->userGroup;
    }

    public function setUserGroup(?UserGroupDTO $userGroup): self
    {
        $this->userGroup = $userGroup;
        return $this;
    }
}
