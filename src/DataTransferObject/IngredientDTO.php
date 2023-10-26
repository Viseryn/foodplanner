<?php namespace App\DataTransferObject;

/**
 * @implements DataTransferObject<Ingredient>
 */
class IngredientDTO implements DataTransferObject
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $quantityValue = null;
    private ?string $quantityUnit = null;
    private ?int $position = null;
    private ?bool $checked = null;
    private ?bool $editable = null;

    public function getId(): ?int 
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getQuantityValue(): ?string
    {
        return $this->quantityValue;
    }

    public function setQuantityValue(?string $quantityValue): self
    {
        $this->quantityValue = $quantityValue;
        return $this;
    }

    public function getQuantityUnit(): ?string
    {
        return $this->quantityUnit;
    }

    public function setQuantityUnit(?string $quantityUnit): self
    {
        $this->quantityUnit = $quantityUnit;
        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(?int $position): self
    {
        $this->position = $position;
        return $this;
    }

    public function getChecked(): ?bool
    {
        return $this->checked;
    }

    public function setChecked(?bool $checked): self
    {
        $this->checked = $checked;
        return $this;
    }

    public function getEditable(): ?bool
    {
        return $this->editable;
    }

    public function setEditable(?bool $editable): self
    {
        $this->editable = $editable;
        return $this;
    }
}
