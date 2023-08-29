<?php namespace App\DataTransferObject;

use App\Entity\Recipe;
use Doctrine\Common\Collections\Collection;

class RecipeDTO implements DataTransferObject
{
    private ?int $id;
    private ?string $title;
    private ?int $portionSize;
    /** @var Collection<IngredientDTO> */
    private Collection $ingredients;
    /** @var Collection<InstructionDTO> */
    private Collection $instructions;
    private ?FileDTO $image;

    public function __construct(Recipe $recipe)
    {
        $this->id = $recipe->getId();
        $this->title = $recipe->getTitle();
        $this->portionSize = $recipe->getPortionSize();
        $this->ingredients = $recipe->getIngredients()->map(fn ($ingredient) => new IngredientDTO($ingredient));
        $this->instructions = $recipe->getInstructions()->map(fn ($instructions) => new InstructionDTO($instructions));
        $this->image = $recipe->getImage() !== null ? new FileDTO($recipe->getImage()) : null;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string 
    {
        return $this->title;
    }

    public function getPortionSize(): ?int
    {
        return $this->portionSize;
    }

    /** @return Collection<IngredientDTO> */
    public function getIngredients(): Collection
    {
        return $this->ingredients;
    }

    /** @return Collection<InstructionDTO> */
    public function getInstructions(): Collection
    {
        return $this->instructions;
    }

    public function getImage(): ?FileDTO
    {
        return $this->image;
    }
}
