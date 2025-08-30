<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use App\Processor\DeleteRecipeImageProcessor;
use App\Processor\DeleteRecipeProcessor;
use App\Processor\PatchRecipeImageProcessor;
use App\Provider\RecipeProvider;
use App\Repository\RecipeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(
            provider: RecipeProvider::class,
        ),
        new Post(
            denormalizationContext: ['groups' => ['recipe:post']],
        ),
        new Patch(
            openapi: new Operation(
                description: 'Updates the Recipe resource. All Ingredient and Instruction resources owned be the Recipe resource will be deleted and fully replaced (with new IDs).',
            ),
            denormalizationContext: ['groups' => ['recipe:patch']],
        ),
        new Delete(
            openapi: new Operation(
                description: 'Removes the Recipe resource by setting a deletion flag. In future versions, deleted Recipe resources will be restorable.',
            ),
            processor: DeleteRecipeProcessor::class,
        ),
        new Patch(
            uriTemplate: "/recipes/{id}/image",
            uriVariables: ["id"],
            openapi: new Operation(
                summary: 'Updates the Image resource of the Recipe.',
                description: 'Updates the Image resource owned by the given Recipe resource. The corresponding file of the old Image resource will be deleted from the file system.',
            ),
            denormalizationContext: ['groups' => ['recipe:image']],
            input: Image::class,
            processor: PatchRecipeImageProcessor::class,
        ),
        new Delete(
            uriTemplate: "/recipes/{id}/image",
            uriVariables: ["id"],
            openapi: new Operation(
                summary: 'Deletes the Image resource of the Recipe.',
                description: 'Deletes the Image resource owned by the given Recipe resource. The corresponding file will be deleted from the file system.',
            ),
            processor: DeleteRecipeImageProcessor::class,
        ),
    ],
    normalizationContext: ['groups' => ['recipe:read']],
    security: 'is_granted("ROLE_ADMIN")',
)]
#[ApiFilter(BooleanFilter::class, properties: ["deleted"])]
#[ORM\Entity(repositoryClass: RecipeRepository::class)]
class Recipe {
    #[Groups(["recipe:read"])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(["recipe:read", "recipe:post", "recipe:patch"])]
    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[Groups(["recipe:read", "recipe:post", "recipe:patch"])]
    #[ORM\Column]
    private ?int $portionSize = null;

    #[Groups(["recipe:read", "recipe:post", "recipe:patch"])]
    #[ORM\OneToMany(targetEntity: Ingredient::class, mappedBy: 'recipe', cascade: ['persist'], orphanRemoval: true)]
    private Collection $ingredients;

    #[Groups(["recipe:read", "recipe:post", "recipe:patch"])]
    #[ORM\OneToMany(targetEntity: Instruction::class, mappedBy: 'recipe', cascade: ['persist'], orphanRemoval: true)]
    private Collection $instructions;

    #[Groups(["recipe:read"])]
    #[ORM\ManyToOne(targetEntity: Image::class, cascade: ['persist'])]
    private ?Image $image = null;

    #[Groups(["recipe:patch"])]
    #[ORM\Column(nullable: true)]
    private ?bool $deleted = null;

    public function __construct() {
        $this->ingredients = new ArrayCollection();
        $this->instructions = new ArrayCollection();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getTitle(): ?string {
        return $this->title;
    }

    public function setTitle(string $title): self {
        $this->title = $title;

        return $this;
    }

    public function getPortionSize(): ?int {
        return $this->portionSize;
    }

    public function setPortionSize(int $portionSize): self {
        $this->portionSize = $portionSize;

        return $this;
    }

    /** @return Collection<int, Ingredient> */
    public function getIngredients(): Collection {
        return $this->ingredients;
    }

    /** @throws Exception */
    public function addIngredient(Ingredient $ingredient): self {
        if (!$this->ingredients->contains($ingredient)) {
            $this->ingredients->add($ingredient);
            $ingredient->setRecipe($this);
        }

        return $this;
    }

    /** @throws Exception */
    public function removeIngredient(Ingredient $ingredient): self {
        if ($this->ingredients->removeElement($ingredient)) {
            // set the owning side to null (unless already changed)
            if ($ingredient->getRecipe() === $this) {
                $ingredient->setRecipe(null);
            }
        }

        return $this;
    }

    /** @return Collection<int, Instruction> */
    public function getInstructions(): Collection {
        return $this->instructions;
    }

    public function addInstruction(Instruction $instruction): self {
        if (!$this->instructions->contains($instruction)) {
            $this->instructions->add($instruction);
            $instruction->setRecipe($this);
        }

        return $this;
    }

    public function removeInstruction(Instruction $instruction): self {
        if ($this->instructions->removeElement($instruction)) {
            // set the owning side to null (unless already changed)
            if ($instruction->getRecipe() === $this) {
                $instruction->setRecipe(null);
            }
        }

        return $this;
    }

    public function getImage(): ?Image {
        return $this->image;
    }

    public function setImage(?Image $image): self {
        $this->image = $image;

        return $this;
    }

    public function isDeleted(): ?bool {
        return $this->deleted;
    }

    public function setDeleted(?bool $deleted): static {
        $this->deleted = $deleted;

        return $this;
    }
}
