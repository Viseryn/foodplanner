<?php

namespace App\Entity;

use App\Repository\IngredientRepository;
use Doctrine\ORM\Mapping as ORM;
use Exception;

#[ORM\Entity(repositoryClass: IngredientRepository::class)]
class Ingredient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 64, nullable: true)]
    private ?string $quantityValue = null;

    #[ORM\Column(length: 16, nullable: true)]
    private ?string $quantityUnit = null;

    #[ORM\ManyToOne(inversedBy: 'ingredients')]
    private ?Recipe $recipe = null;

    #[ORM\ManyToOne(inversedBy: 'ingredients')]
    private ?Storage $storage = null;

    #[ORM\Column]
    private ?int $position = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Returns the quantity value as float.
     * Checks for specific fractions like "1/2"
     * and converts them manually.
     *
     * @return string|null
     */
    public function getQuantityValueAsFloat(): ?string
    {
        $returnValue = $this->quantityValue;
        
        switch($returnValue) {
            case '1/2':
                $returnValue = 0.5;
                break;
        }
        
        return (float) $returnValue;
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

    /**
     * Returns combined quantity value and unit.
     *
     * @return string|null
     */
    public function getQuantity(): ?string
    {
        $str = $this->getQuantityValue();

        if ($str != '' && $this->getQuantityUnit() !== '') {
            $str .= ' ' . $this->getQuantityUnit();
        } elseif ($this->getQuantityUnit() !== '') {
            $str .= $this->getQuantityUnit();
        }
        
        return $str;
    }

    /**
     * Sets quantityValue and quantityUnit at the same time.
     * The parameter needs to be an array of the form [?string, ?string].
     *
     * @param array $quantity
     * @return self
     */
    public function setQuantity(array $quantity = [null, null]): self 
    {
        if(count($quantity) === 2) {
            $this->setQuantityValue((string) $quantity[0]);
            $this->setQuantityUnit((string) $quantity[1]);
        } else {
            throw new Exception('Parameter for setQuantity() is not an array with two entries.');
        }

        return $this;
    }

    public function getRecipe(): ?Recipe
    {
        return $this->recipe;
    }

    public function setRecipe(?Recipe $recipe): self
    {
        if ($this->storage == null) {
            $this->recipe = $recipe;
        } else {
            throw new Exception('Cannot set recipe if storage is already set.');
        }

        return $this;
    }

    public function getStorage(): ?Storage
    {
        return $this->storage;
    }

    public function setStorage(?Storage $storage): self
    {
        if ($this->recipe == null) {
            $this->storage = $storage;
        } else {
            throw new Exception('Cannot set storage if recipe is already set.');
        }

        return $this;
    }

    public function __toString() {
        return $this->name;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(int $position): self
    {
        $this->position = $position;

        return $this;
    }
}
