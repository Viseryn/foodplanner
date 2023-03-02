<?php namespace App\Service;

/**
 * ShoppingListUtil
 */
class ShoppingListUtil extends StorageUtil
{
    public function deleteAll(): StorageUtil
    {
        // Delete all shopping list ingredients from database
        $ingredients = $this->ingredientRepository->findBy(['storage' => '2'], ['position' => 'ASC']);
        
        foreach($ingredients as $ingredient) {
            $this->ingredientRepository->remove($ingredient, true);
        }

        return $this;
    }

    protected function prepareIngredients(array &$ingredients): array 
    {
        // Get ShoppingList storage
        $storage = $this->storageRepository->find(2);

        // Get highest position
        $lastIngredient = $this->ingredientRepository->findOneBy(['storage' => '2'], ['position' => 'DESC']);
        $lastPosition = $lastIngredient?->getPosition() ?? 0;
        $position = $lastPosition + 1;

        // Set remaining properties
        foreach ($ingredients as $ingredient) {
            $ingredient
                ->setStorage($storage)
                ->setChecked(false)
                ->setPosition($position)
            ;

            // Increment position for next ingredient
            $position++;
        }

        // Return modified objects
        return $ingredients;
    }
}
