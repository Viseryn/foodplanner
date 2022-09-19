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
    private Collection $ingredientList;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    public function __construct()
    {
        $this->ingredientList = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Ingredient>
     */
    public function getIngredientList(): Collection
    {
        return $this->ingredientList;
    }

    public function addIngredientList(Ingredient $ingredientList): self
    {
        if (!$this->ingredientList->contains($ingredientList)) {
            $this->ingredientList->add($ingredientList);
            $ingredientList->setStorage($this);
        }

        return $this;
    }

    public function removeIngredientList(Ingredient $ingredientList): self
    {
        if ($this->ingredientList->removeElement($ingredientList)) {
            // set the owning side to null (unless already changed)
            if ($ingredientList->getStorage() === $this) {
                $ingredientList->setStorage(null);
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
