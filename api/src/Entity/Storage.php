<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\OpenApi\Model\Operation;
use App\ApiResource\StorageOrdering;
use App\Processor\StorageOrderingProcessor;
use App\Provider\StorageProvider;
use App\Repository\StorageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(security: "is_granted('ROLE_ADMIN')")]
#[Get(
    normalizationContext: ['groups' => ['storage:read']],
)]
#[Patch(
    uriTemplate: "/storages/{storageId}/ordering",
    uriVariables: ["storageId"],
    openapi: new Operation(
        summary: 'Updates the ordering of a Storage resource.',
        description: 'Fully updates the ordering of Ingredient resources in the given Storage resource by reassigning their position values. Note that the position value corresponds anti-proportionally to the list position (i.e., the Ingredient resource that appears first in a storage list has the highest position value).',
    ),
    normalizationContext: ['groups' => ['storageOrdering:patch']],
    denormalizationContext: ['groups' => ['storageOrdering:patch']],
    input: StorageOrdering::class,
    provider: StorageProvider::class,
    processor: StorageOrderingProcessor::class,
)]
#[ORM\Entity(repositoryClass: StorageRepository::class)]
class Storage {
    #[Groups(["storage:read"])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(["storage:read", "storageOrdering:patch"])]
    #[ORM\OneToMany(targetEntity: Ingredient::class, mappedBy: 'storage', orphanRemoval: true)]
    private Collection $ingredients;

    #[Groups(["storage:read", "storageOrdering:patch"])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    public function __construct() {
        $this->ingredients = new ArrayCollection();
    }

    public function getId(): ?int {
        return $this->id;
    }

    /** @return Collection<int, Ingredient> */
    public function getIngredients(): Collection {
        return $this->ingredients;
    }

    /** @throws \Exception */
    public function addIngredient(Ingredient $ingredient): self {
        if (!$this->ingredients->contains($ingredient)) {
            $this->ingredients->add($ingredient);
            $ingredient->setStorage($this);
        }

        return $this;
    }

    /** @throws \Exception */
    public function removeIngredient(Ingredient $ingredient): self {
        if ($this->ingredients->removeElement($ingredient)) {
            // set the owning side to null (unless already changed)
            if ($ingredient->getStorage() === $this) {
                $ingredient->setStorage(null);
            }
        }

        return $this;
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): self {
        $this->name = $name;

        return $this;
    }
}
