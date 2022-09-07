<?php

namespace App\Entity;

use App\Repository\RecipeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RecipeRepository::class)]
class Recipe
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column]
    private ?int $portionSize = null;

    #[ORM\OneToMany(mappedBy: 'recipe', targetEntity: QuantifiedIngredient::class)]
    private Collection $ingredientList;

    #[ORM\Column(type: Types::ARRAY, nullable: true)]
    private array $instructionList = [];

    public function __construct()
    {
        $this->ingredientList = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getPortionSize(): ?int
    {
        return $this->portionSize;
    }

    public function setPortionSize(int $portionSize): self
    {
        $this->portionSize = $portionSize;

        return $this;
    }

    /**
     * @return Collection<int, QuantifiedIngredient>
     */
    public function getIngredientList(): Collection
    {
        return $this->ingredientList;
    }

    public function addIngredientList(QuantifiedIngredient $ingredientList): self
    {
        if (!$this->ingredientList->contains($ingredientList)) {
            $this->ingredientList->add($ingredientList);
            $ingredientList->setRecipe($this);
        }

        return $this;
    }

    public function removeIngredientList(QuantifiedIngredient $ingredientList): self
    {
        if ($this->ingredientList->removeElement($ingredientList)) {
            // set the owning side to null (unless already changed)
            if ($ingredientList->getRecipe() === $this) {
                $ingredientList->setRecipe(null);
            }
        }

        return $this;
    }

    public function getInstructionList(): array
    {
        return $this->instructionList;
    }

    public function setInstructionList(?array $instructionList): self
    {
        $this->instructionList = $instructionList;

        return $this;
    }
}
