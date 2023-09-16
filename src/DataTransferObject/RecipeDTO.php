<?php namespace App\DataTransferObject;

use Doctrine\Common\Collections\ReadableCollection;

/**
 * @implements DataTransferObject<Recipe>
 */
class RecipeDTO implements DataTransferObject
{
    private ?int $id = null;
    private ?string $title = null;
    private ?int $portionSize = null;
    /** @var ReadableCollection<IngredientDTO>|null */
    private ?ReadableCollection $ingredients = null;
    /** @var ReadableCollection<InstructionDTO>|null */
    private ?ReadableCollection $instructions = null;
    private ?ImageDTO $image = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getTitle(): ?string 
    {
        return $this->title;
    }

    public function setTitle(?string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getPortionSize(): ?int
    {
        return $this->portionSize;
    }

    public function setPortionSize(?int $portionSize): self
    {
        $this->portionSize = $portionSize;
        return $this;
    }

    /** @return ReadableCollection<IngredientDTO>|null */
    public function getIngredients(): ?ReadableCollection
    {
        return $this->ingredients;
    }

    /**
     * @param ReadableCollection<IngredientDTO>|null $ingredients
     * @return $this
     */
    public function setIngredients(?ReadableCollection $ingredients): self
    {
        $this->ingredients = $ingredients;
        return $this;
    }

    /** @return ReadableCollection<InstructionDTO>|null */
    public function getInstructions(): ?ReadableCollection
    {
        return $this->instructions;
    }

    /**
     * @param ReadableCollection<InstructionDTO>|null $instructions
     * @return $this
     */
    public function setInstructions(?ReadableCollection $instructions): self
    {
        $this->instructions = $instructions;
        return $this;
    }

    public function getImage(): ?ImageDTO
    {
        return $this->image;
    }

    public function setImage(?ImageDTO $image): self
    {
        $this->image = $image;
        return $this;
    }
}
