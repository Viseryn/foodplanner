<?php namespace App\DataTransferObject;

use Doctrine\Common\Collections\ReadableCollection;

/**
 * @implements DataTransferObject<Storage>
 */
class StorageDTO implements DataTransferObject
{
    private ?int $id = null;
    private ?string $name = null;
    /** @var ReadableCollection<IngredientDTO>|null */
    private ?ReadableCollection $ingredients = null;

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

    /**
     * @return ReadableCollection<IngredientDTO>|null
     */
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
}
