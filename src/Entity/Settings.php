<?php

namespace App\Entity;

use App\Repository\SettingsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SettingsRepository::class)]
class Settings implements EntityInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $showPantry = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne]
    private ?UserGroup $standardUserGroup = null;

    #[ORM\ManyToOne]
    private ?MealCategory $standardMealCategory = null;

    #[ORM\Column(length: 255)]
    private ?string $recipeListViewMode = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isShowPantry(): ?bool
    {
        return $this->showPantry;
    }

    public function setShowPantry(bool $showPantry): self
    {
        $this->showPantry = $showPantry;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getStandardUserGroup(): ?UserGroup
    {
        return $this->standardUserGroup;
    }

    public function setStandardUserGroup(?UserGroup $standardUserGroup): static
    {
        $this->standardUserGroup = $standardUserGroup;

        return $this;
    }

    public function getStandardMealCategory(): ?MealCategory
    {
        return $this->standardMealCategory;
    }

    public function setStandardMealCategory(?MealCategory $standardMealCategory): static
    {
        $this->standardMealCategory = $standardMealCategory;

        return $this;
    }

    public function getRecipeListViewMode(): ?string
    {
        return $this->recipeListViewMode;
    }

    public function setRecipeListViewMode(string $recipeListViewMode): static
    {
        $this->recipeListViewMode = $recipeListViewMode;

        return $this;
    }
}
