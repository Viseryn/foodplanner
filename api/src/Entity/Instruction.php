<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\InstructionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\Ignore;

#[ApiResource(operations: [], security: "is_granted('ROLE_ADMIN')")]
#[ORM\Entity(repositoryClass: InstructionRepository::class)]
class Instruction {
    #[Groups(["recipe:read"])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(["recipe:read", "recipe:post", "recipe:patch"])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $instruction = null;

    #[Ignore]
    #[ORM\ManyToOne(inversedBy: 'instructions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Recipe $recipe = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getInstruction(): ?string {
        return $this->instruction;
    }

    public function setInstruction(string $instruction): self {
        $this->instruction = $instruction;

        return $this;
    }

    public function getRecipe(): ?Recipe {
        return $this->recipe;
    }

    public function setRecipe(?Recipe $recipe): self {
        $this->recipe = $recipe;

        return $this;
    }
}
