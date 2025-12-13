<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Provider\RecipeExportProvider;
use Doctrine\Common\Collections\ReadableCollection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: "/recipes/export/{id}",
            formats: ["json" => ["application/json"]],
            uriVariables: ["id"],
            requirements: ["id" => "\d+"],
            normalizationContext: ["groups" => ["recipe:export"]],
            provider: RecipeExportProvider::class,
        ),
    ],
    security: 'is_granted("ROLE_ADMIN")',
)]
final readonly class RecipeExport {
    private int $id;

    #[Groups(["recipe:export"])]
    private string $title;

    #[Groups(["recipe:export"])]
    private int $portionSize;

    #[Groups(["recipe:export"])]
    private string $externalUrl;

    /** @var ReadableCollection<IngredientExport> */
    #[Groups(["recipe:export"])]
    private ReadableCollection $ingredients;

    /** @var ReadableCollection<InstructionExport> */
    #[Groups(["recipe:export"])]
    private ReadableCollection $instructions;

    #[Groups(["recipe:export"])]
    private string $image;

    #[Groups(["recipe:export"])]
    private bool $sideDish;

    public function __construct(
        int $id,
        string $title,
        int $portionSize,
        string $externalUrl,
        ReadableCollection $ingredients,
        ReadableCollection $instructions,
        string $image,
        bool $sideDish,
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->portionSize = $portionSize;
        $this->externalUrl = $externalUrl;
        $this->ingredients = $ingredients;
        $this->instructions = $instructions;
        $this->image = $image;
        $this->sideDish = $sideDish;
    }

    public function getId(): int {
        return $this->id;
    }

    public function getTitle(): string {
        return $this->title;
    }

    public function getPortionSize(): int {
        return $this->portionSize;
    }

    public function getExternalUrl(): string {
        return $this->externalUrl;
    }

    public function getIngredients(): ReadableCollection {
        return $this->ingredients;
    }

    public function getInstructions(): ReadableCollection {
        return $this->instructions;
    }

    public function getImage(): string {
        return $this->image;
    }

    public function isSideDish(): bool {
        return $this->sideDish;
    }
}
