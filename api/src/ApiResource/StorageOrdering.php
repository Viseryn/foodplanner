<?php

namespace App\ApiResource;

use App\Entity\Ingredient;
use Symfony\Component\Serializer\Annotation\Groups;

/** **Ordered** collection of ingredients. */
class StorageOrdering {
    /** @var Ingredient[] */
    #[Groups(['storageOrdering:patch'])]
    private array $ingredients = [];

    /** @return Ingredient[] */
    public function getIngredients(): array {
        return $this->ingredients;
    }

    /** @param Ingredient[] $ingredients */
    public function setIngredients(array $ingredients): StorageOrdering {
        $this->ingredients = $ingredients;
        return $this;
    }
}
