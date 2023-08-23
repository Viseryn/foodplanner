<?php namespace App\Service;

use App\Entity\Ingredient;
use App\Entity\Storage;
use App\Repository\IngredientRepository;
use Doctrine\Common\Collections\ArrayCollection;

final class StorageControllerService
{
    public function __construct(
        private IngredientRepository $ingredientRepository,
    ) {}

    public function deleteAllIngredients(Storage $storage): void
    {
        $ingredients = $this->ingredientRepository->findBy(['storage' => $storage->getId()], ['position' => 'ASC']);

        foreach($ingredients as $ingredient) {
            $this->ingredientRepository->remove($ingredient, true);
        }
    }

    public function mapIngredientModelToEntity(object $ingredientModel): Ingredient
    {
        return (new Ingredient)->setName($ingredientModel->name)
                               ->setQuantityValue($ingredientModel->quantityValue)
                               ->setQuantityUnit($ingredientModel->quantityUnit)
                               ->setPosition($ingredientModel->position)
                               ->setChecked($ingredientModel->checked);
    }

    /**
     * @param object[] $ingredientModels
     * @return ArrayCollection<Ingredient>
     */
    public function mapIngredientModelsToEntities(array $ingredientModels): ArrayCollection
    {
        /** @var ArrayCollection<Ingredient> $ingredients */
        $ingredients = new ArrayCollection();
        foreach ($ingredientModels as $ingredientModel) {
            $ingredients->add($this->mapIngredientModelToEntity($ingredientModel));
        }
        return $ingredients;
    }
}
