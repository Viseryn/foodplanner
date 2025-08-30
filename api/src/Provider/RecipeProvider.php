<?php

namespace App\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\RecipeRepository;

final readonly class RecipeProvider implements ProviderInterface {

    public function __construct(
        private RecipeRepository $recipeRepository,
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null {
        $filters = $context["filters"] ?? [];
        $showDeleted = $filters["deleted"] ?? null;

        return $this->recipeRepository->findAllBy($showDeleted === "true");
    }
}
