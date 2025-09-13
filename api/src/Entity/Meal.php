<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Provider\MealProvider;
use App\Repository\MealRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(
    operations: [
        new GetCollection(
            provider: MealProvider::class,
        ),
        new Post(),
        new Patch(),
        new Delete(),
    ],
    security: 'is_granted("ROLE_ADMIN")',
)]
#[ORM\Entity(repositoryClass: MealRepository::class)]
class Meal {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?MealCategory $mealCategory = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Recipe $recipe = null;

    #[ORM\ManyToOne(inversedBy: 'meals')]
    #[ORM\JoinColumn(nullable: false)]
    private ?UserGroup $userGroup = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getMealCategory(): ?MealCategory {
        return $this->mealCategory;
    }

    public function setMealCategory(?MealCategory $mealCategory): self {
        $this->mealCategory = $mealCategory;

        return $this;
    }

    public function getRecipe(): ?Recipe {
        return $this->recipe;
    }

    public function setRecipe(?Recipe $recipe): self {
        $this->recipe = $recipe;

        return $this;
    }

    public function getUserGroup(): ?UserGroup {
        return $this->userGroup;
    }

    public function setUserGroup(?UserGroup $userGroup): self {
        $this->userGroup = $userGroup;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static {
        $this->date = $date;

        return $this;
    }
}
