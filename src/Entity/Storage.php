<?php

namespace App\Entity;

use App\Repository\StorageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StorageRepository::class)]
class Storage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToMany(mappedBy: 'storage', targetEntity: Ingredient::class)]
    private Collection $ingredients;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    public function __construct()
    {
        $this->ingredients = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Ingredient>
     */
    public function getIngredients(): Collection
    {
        return $this->ingredients;
    }

    public function addIngredientList(Ingredient $ingredients): self
    {
        if (!$this->ingredients->contains($ingredients)) {
            $this->ingredients->add($ingredients);
            $ingredients->setStorage($this);
        }

        return $this;
    }

    public function removeIngredients(Ingredient $ingredients): self
    {
        if ($this->ingredients->removeElement($ingredients)) {
            // set the owning side to null (unless already changed)
            if ($ingredients->getStorage() === $this) {
                $ingredients->setStorage(null);
            }
        }

        return $this;
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
}
