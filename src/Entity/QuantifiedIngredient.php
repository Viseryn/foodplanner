<?php

namespace App\Entity;

use App\Repository\QuantifiedIngredientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QuantifiedIngredientRepository::class)]
class QuantifiedIngredient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'ingredientList')]
    private ?Recipe $recipe = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ingredient $ingredient = null;

    #[ORM\Column(nullable: true)]
    private ?int $quantityValue = null;

    #[ORM\Column(length: 16, nullable: true)]
    private ?string $quantityUnit = null;

    #[ORM\ManyToOne(inversedBy: 'ingredientList')]
    private ?Storage $storage = null;

    public function __construct()
    {
        $this->recipeList = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRecipe(): ?Recipe
    {
        return $this->recipeList;
    }

    public function setRecipe(?Recipe $recipe): self
    {
        $this->recipe = $recipe;

        return $this;
    }

    public function getIngredient(): ?Ingredient
    {
        return $this->ingredient;
    }

    public function setIngredient(?Ingredient $ingredient): self
    {
        $this->ingredient = $ingredient;

        return $this;
    }

    public function getQuantityValue(): ?int
    {
        return $this->quantityValue;
    }

    public function setQuantityValue(?int $quantityValue): self
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

    public function getStorage(): ?Storage
    {
        return $this->storage;
    }

    public function setStorage(?Storage $storage): self
    {
        $this->storage = $storage;

        return $this;
    }
}
