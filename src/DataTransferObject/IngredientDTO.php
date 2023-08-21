<?php namespace App\DataTransferObject;

use App\Entity\Ingredient;

class IngredientDTO implements DataTransferObject
{
    private ?int $id;
    private ?string $name;
    private ?string $quantityValue;
    private ?string $quantityUnit;
    private ?int $position;
    private ?bool $checked;

    public function __construct(Ingredient $ingredient) 
    {
        $this->id = $ingredient->getId();
        $this->name = $ingredient->getName();
        $this->quantityValue = $ingredient->getQuantityValue();
        $this->quantityUnit = $ingredient->getQuantityUnit();
        $this->position = $ingredient->getPosition();
        $this->checked = $ingredient->isChecked();
    }

    public function getId(): ?int 
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function getQuantityValue(): ?string
    {
        return $this->quantityValue;
    }

    public function getQuantityUnit(): ?string
    {
        return $this->quantityUnit;
    }

    public function getPosition(): ?string
    {
        return $this->position;
    }

    public function getChecked(): ?bool
    {
        return $this->checked;
    }
}
