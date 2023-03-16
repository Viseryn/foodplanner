<?php namespace App\Service;

use App\Entity\EntityModel;
use App\Entity\MealCategory;
use App\Repository\MealCategoryRepository;

/**
 * MealCategoryUtil
 */
class MealCategoryUtil extends EntityUtil
{
    private MealCategoryRepository $mealCategoryRepository;

    public function __construct(MealCategoryRepository $mealCategoryRepository) 
    {
        $this->mealCategoryRepository = $mealCategoryRepository;
    }

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
    
    /**
     * Updates the standard MealCategory.
     *
     * @param array $categories An array of MealCategoryModel JSON objects.
     * @return void
     */
    public function updateStandard(array $categories): void 
    {
        // Update each UserGroup in the database according to the request array
        foreach ($categories as $category) {
            // Set this to true when standard is set, so there is only one standard group
            $setStandard = false;

            // Get UserGroup from db
            $categoryDb = $this->mealCategoryRepository->find($category->id);
            
            if ($category->standard && !$setStandard) {
                $categoryDb->setStandard(true);
                $setStandard = true;
            } else {
                $categoryDb->setStandard(false);
            }

            // Update group in database
            $this->mealCategoryRepository->add($categoryDb, true);
        }
    }
}
