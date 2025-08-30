<?php

namespace App\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\RecipeExport;
use App\Component\Response\PrettyJsonResponse;
use App\Mapper\RecipeExportMapper;
use App\Repository\RecipeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

/** @implements ProviderInterface<RecipeExport> */
final readonly class RecipeFullExportProvider implements ProviderInterface {

    public function __construct(
        private RecipeExportMapper $recipeExportMapper,
        private RecipeRepository $recipeRepository,
        private SerializerInterface $serializer,
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Response {
        $recipes = $this->recipeRepository->findAllBy(false);

        $recipeExports = (new ArrayCollection($recipes))
            ->map(fn ($recipe) => $this->recipeExportMapper->toArray($this->recipeExportMapper->toExportDto($recipe)))
            ->toArray();

        return new PrettyJsonResponse(
            $this->serializer->serialize($recipeExports, 'json'),
            200,
            [
                "Content-Disposition" => 'attachment; filename="recipes_full_export.json"',
                "Content-Type" => 'application/json'
            ],
            true
        );
    }
}
