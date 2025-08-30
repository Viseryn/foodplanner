<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\MealCategoryRepository;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(security: "is_granted('ROLE_ADMIN')")]
#[Get]
#[GetCollection]
#[ORM\Entity(repositoryClass: MealCategoryRepository::class)]
class MealCategory {
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 64)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $icon = null;

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

    public function getIcon(): ?string {
        return $this->icon;
    }

    public function setIcon(string $icon): self {
        $this->icon = $icon;

        return $this;
    }
}
