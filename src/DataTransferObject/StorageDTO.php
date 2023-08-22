<?php namespace App\DataTransferObject;

use App\Entity\Storage;
use Doctrine\Common\Collections\ReadableCollection;

class StorageDTO implements DataTransferObject
{
    private ?int $id;
    private ?string $name;
    /** @var ReadableCollection<IngredientDTO> */
    private ReadableCollection $ingredients;

    public function __construct(Storage $storage)
    {
        $this->id = $storage->getId();
        $this->name = $storage->getName();
        $this->ingredients = $storage->getIngredients()->map(fn ($ingredient) => new IngredientDTO($ingredient));
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function getIngredients(): ReadableCollection
    {
        return $this->ingredients;
    }
}
