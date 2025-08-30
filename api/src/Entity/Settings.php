<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use App\Provider\SettingsProvider;
use App\Repository\SettingsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    uriTemplate: '/users/me/settings',
    operations: [
        new Get(
            normalizationContext: ['groups' => ['ownuser:read']],
            provider: SettingsProvider::class,
        ),
        new Patch(
            normalizationContext: ['groups' => ['ownuser:read']],
            denormalizationContext: ['groups' => ['ownuser:patch']],
            read: true,
            provider: SettingsProvider::class,
        ),
    ],
    security: "is_granted('ROLE_USER')",
)]
#[ORM\Entity(repositoryClass: SettingsRepository::class)]
class Settings {
    #[Groups(['ownuser:read', 'ownuser:patch'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['ownuser:read', 'ownuser:patch'])]
    #[ORM\Column]
    private ?bool $showPantry = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[Groups(['ownuser:read', 'ownuser:patch'])]
    #[ORM\ManyToOne]
    private ?UserGroup $standardUserGroup = null;

    #[Groups(['ownuser:read', 'ownuser:patch'])]
    #[ORM\ManyToOne]
    private ?MealCategory $standardMealCategory = null;

    #[Groups(['ownuser:read', 'ownuser:patch'])]
    #[ORM\Column(type: 'string', length: 255, enumType: RecipeListViewMode::class)]
    private ?RecipeListViewMode $recipeListViewMode = null;

    #[Groups(['ownuser:read', 'ownuser:patch'])]
    #[ORM\Column(type: 'string', length: 255, nullable: true, enumType: Homepage::class)]
    private ?Homepage $homepage = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function isShowPantry(): ?bool {
        return $this->showPantry;
    }

    public function setShowPantry(bool $showPantry): self {
        $this->showPantry = $showPantry;

        return $this;
    }

    public function getUser(): ?User {
        return $this->user;
    }

    public function setUser(User $user): self {
        $this->user = $user;

        return $this;
    }

    public function getStandardUserGroup(): ?UserGroup {
        return $this->standardUserGroup;
    }

    public function setStandardUserGroup(?UserGroup $standardUserGroup): static {
        $this->standardUserGroup = $standardUserGroup;

        return $this;
    }

    public function getStandardMealCategory(): ?MealCategory {
        return $this->standardMealCategory;
    }

    public function setStandardMealCategory(?MealCategory $standardMealCategory): static {
        $this->standardMealCategory = $standardMealCategory;

        return $this;
    }

    public function getRecipeListViewMode(): ?RecipeListViewMode {
        return $this->recipeListViewMode;
    }

    public function setRecipeListViewMode(RecipeListViewMode $recipeListViewMode): static {
        $this->recipeListViewMode = $recipeListViewMode;

        return $this;
    }

    public function getHomepage(): ?Homepage {
        return $this->homepage;
    }

    public function setHomepage(?Homepage $homepage): static {
        $this->homepage = $homepage;

        return $this;
    }
}
