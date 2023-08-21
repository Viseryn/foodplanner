<?php namespace App\Service;

use App\Entity\EntityInterface;
use App\Entity\Meal;

/**
 * MealUtil
 */
class MealUtil extends EntityUtil
{
    private RecipeUtil $recipeUtil;
    private MealCategoryUtil $mealCategoryUtil;
    private UserGroupUtil $userGroupUtil;

    public function __construct(
        RecipeUtil $recipeUtil,
        MealCategoryUtil $mealCategoryUtil,
        UserGroupUtil $userGroupUtil,
    ) {
        $this->recipeUtil = $recipeUtil;
        $this->mealCategoryUtil = $mealCategoryUtil;
        $this->userGroupUtil = $userGroupUtil;
    }

    /** @param Meal $meal */
    public function getApiModel(EntityInterface $meal): array
    {
        return [
            'id' => $meal->getId(),
            'recipe' => $this->recipeUtil->getApiModel($meal->getRecipe()),
            'mealCategory' => $this->mealCategoryUtil->getApiModel($meal->getMealCategory()),
            'userGroup' => $this->userGroupUtil->getApiModel($meal->getUserGroup()),
        ];
    }
}
