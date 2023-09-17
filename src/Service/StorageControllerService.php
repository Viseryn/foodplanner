<?php namespace App\Service;

use App\Entity\Storage;
use App\Repository\IngredientRepository;

final class StorageControllerService
{
    public function __construct(
        private readonly IngredientRepository $ingredientRepository,
    ) {}

    public function deleteAllIngredients(Storage $storage): void
    {
        $ingredients = $this->ingredientRepository->findBy(['storage' => $storage->getId()], ['position' => 'ASC']);

        foreach ($ingredients as $ingredient) {
            $this->ingredientRepository->remove($ingredient, true);
        }
    }
}
