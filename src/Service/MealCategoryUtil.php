<?php namespace App\Service;

use App\Entity\EntityModel;
use App\Entity\MealCategory;

/**
 * MealCategoryUtil
 */
class MealCategoryUtil extends EntityUtil
{
    /** @param MealCategory $mealCategory */
    public function getApiModel(EntityModel $mealCategory): array
    {
        return [
            'id' => $mealCategory->getId(),
            'name' => $mealCategory->getName(),
            'icon' => $mealCategory->getIcon(),
            'standard' => $mealCategory->isStandard(),
            'option' => [
                'id' => 'mealCategory_' . $mealCategory->getName(),
                'label' => $mealCategory->getName(),
                'icon' => $mealCategory->getIcon(),
                'checked' => $mealCategory->isStandard(),
                'value' => $mealCategory->getId(),
            ],
        ];
    }
}
