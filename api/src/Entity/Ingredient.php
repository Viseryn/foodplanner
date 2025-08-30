<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\IngredientRepository;
use App\Validator\HasStoragePosition;
use App\Validator\StorageXorRecipe;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['ingredient:read']],
        ),
        new Post(
            normalizationContext: ['groups' => ['ingredient:read']],
            denormalizationContext: ['groups' => ['ingredient:post']],
        ),
        new Patch(
            normalizationContext: ['groups' => ['ingredient:read']],
            denormalizationContext: ['groups' => ['ingredient:patch']],
        ),
        new Delete(),
    ],
    security: "is_granted('ROLE_ADMIN')",
)]
#[ApiFilter(SearchFilter::class, properties: ['storage.name' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['position' => 'exact'], arguments: ['orderParameterName' => 'order'])]
#[ORM\Entity(repositoryClass: IngredientRepository::class)]
class Ingredient {
    #[Groups(["ingredient:read", "recipe:read", "storage:read"])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(["ingredient:read", "ingredient:post", "ingredient:patch", "recipe:read", "recipe:post", "recipe:patch", "storage:read"])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Groups(["ingredient:read", "ingredient:post", "ingredient:patch", "recipe:read", "recipe:post", "recipe:patch", "storage:read"])]
    #[ORM\Column(length: 64, nullable: true)]
    private ?string $quantityValue = null;

    #[Groups(["ingredient:read", "ingredient:post", "ingredient:patch", "recipe:read", "recipe:post", "recipe:patch", "storage:read"])]
    #[ORM\Column(length: 64, nullable: true)]
    private ?string $quantityUnit = null;

    #[StorageXorRecipe(groups: ["ingredient:post", "ingredient:patch"])]
    #[ORM\ManyToOne(inversedBy: 'ingredients')]
    private ?Recipe $recipe = null;

    #[Groups(["ingredient:read", "ingredient:post", "storage:read"])]
    #[StorageXorRecipe(groups: ["ingredient:post", "ingredient:patch"])]
    #[ORM\ManyToOne(inversedBy: 'ingredients')]
    private ?Storage $storage = null;

    #[Groups(["ingredient:read", "ingredient:post", "ingredient:patch", "storage:read"])]
    #[HasStoragePosition(groups: ["ingredient:post", "ingredient:patch"])]
    #[ORM\Column(nullable: true)]
    private ?int $position = null;

    #[Groups(["ingredient:read", "ingredient:patch", "recipe:read", "storage:read"])]
    #[ORM\Column(nullable: true)]
    private ?bool $checked = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): self {
        $this->name = $name;

        return $this;
    }

    public function getQuantityValue(): ?string {
        return $this->quantityValue;
    }

    public function setQuantityValue(?string $quantityValue): self {
        $this->quantityValue = $quantityValue;

        return $this;
    }

    public function getQuantityUnit(): ?string {
        return $this->quantityUnit;
    }

    public function setQuantityUnit(?string $quantityUnit): self {
        $this->quantityUnit = $quantityUnit;

        return $this;
    }

    public function getRecipe(): ?Recipe {
        return $this->recipe;
    }

    /** @throws Exception */
    public function setRecipe(?Recipe $recipe): self {
        if ($this->storage == null) {
            $this->recipe = $recipe;
        } else {
            throw new Exception('Cannot set recipe if storage is already set.');
        }

        return $this;
    }

    public function getStorage(): ?Storage {
        return $this->storage;
    }

    /** @throws Exception */
    public function setStorage(?Storage $storage): self {
        if ($this->recipe == null) {
            $this->storage = $storage;
        } else {
            throw new Exception('Cannot set storage if recipe is already set.');
        }

        return $this;
    }

    public function getPosition(): ?int {
        return $this->position;
    }

    public function setPosition(?int $position): self {
        $this->position = $position;

        return $this;
    }

    public function isChecked(): ?bool {
        return $this->checked;
    }

    public function setChecked(?bool $checked): self {
        $this->checked = $checked;

        return $this;
    }
}
