<?php

namespace App\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\RecipeExport;
use App\Component\Response\PrettyJsonResponse;
use App\Mapper\RecipeExportMapper;
use App\Repository\RecipeRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Serializer\SerializerInterface;

/** @implements ProviderInterface<RecipeExport> */
final readonly class RecipeExportProvider implements ProviderInterface {

    public function __construct(
        private RecipeExportMapper $recipeExportMapper,
        private RecipeRepository $recipeRepository,
        private SerializerInterface $serializer,
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Response {
        $recipe = $this->recipeRepository->findUndeleted($uriVariables["id"]);

        if ($recipe === null) {
            throw new NotFoundHttpException();
        }

        $recipeExport = $this->recipeExportMapper->toExportDto($recipe);

        return new PrettyJsonResponse(
            $this->serializer->serialize($recipeExport, 'json'),
            200,
            [
                "Content-Disposition" => 'attachment; filename="recipe_' . $recipeExport->getTitle() . '.json"',
                "Content-Type" => 'application/json'
            ],
            true,
        );
    }
}
