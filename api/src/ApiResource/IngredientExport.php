<?php

namespace App\ApiResource;

use Symfony\Component\Serializer\Annotation\Groups;

final readonly class IngredientExport {
    #[Groups(["recipe:export"])]
    private string $name;

    #[Groups(["recipe:export"])]
    private string $quantityValue;

    #[Groups(["recipe:export"])]
    private string $quantityUnit;

    public function __construct(string $name, string $quantityValue, string $quantityUnit) {
        $this->name = $name;
        $this->quantityValue = $quantityValue;
        $this->quantityUnit = $quantityUnit;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getQuantityValue(): string {
        return $this->quantityValue;
    }

    public function getQuantityUnit(): string {
        return $this->quantityUnit;
    }
}
