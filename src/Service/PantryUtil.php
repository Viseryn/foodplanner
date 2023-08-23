<?php namespace App\Service;

/**
 * PantryUtil
 */
class PantryUtil extends StorageUtil
{
    protected function prepareIngredients(array &$ingredients): array 
    {
        // Get Pantry storage
        $storage = $this->storageRepository->find(1);

        // Get highest position
        $lastIngredient = $this->ingredientRepository->findOneBy(['storage' => '1'], ['position' => 'DESC']);
        $lastPosition = $lastIngredient?->getPosition() ?? 0;
        $position = $lastPosition + 1;

        // Set remaining properties
        foreach ($ingredients as $ingredient) {
            $ingredient
                ->setStorage($storage)
                ->setPosition($position)
            ;

            // Increment position for next ingredient
            $position++;
        }

        // Return modified objects
        return $ingredients;
    }
}
