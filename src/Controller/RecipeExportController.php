<?php namespace App\Controller;

use App\Component\Response\PrettyJsonResponse;
use App\Entity\Recipe;
use App\Mapper\RecipeExportMapper;
use App\Repository\RecipeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/export/recipes')]
class RecipeExportController extends AbstractControllerWithMapper {
    public function __construct(
        private readonly RecipeRepository $recipeRepository,
        private readonly RecipeExportMapper $recipeExportMapper,
    ) {
        parent::__construct(Recipe::class);
    }

    #[Route('/{id}', name: 'api_export_recipes_get', methods: ['GET'])]
    public function get(Recipe $recipe): Response {
        return new PrettyJsonResponse($this->recipeExportMapper->toArray(
            $this->recipeExportMapper->toExportDto($recipe)
        ));
    }

    #[Route('', name: 'api_export_recipes_getAll', methods: ['GET'])]
    public function getAll(): Response {
        $recipes = $this->recipeRepository->findBy([], ['title' => 'ASC']);
        $recipeExportDtos = (new ArrayCollection($recipes))
            ->map(fn ($recipe) => $this->recipeExportMapper->toArray($this->recipeExportMapper->toExportDto($recipe)))
            ->toArray();
        return new PrettyJsonResponse($recipeExportDtos);
    }
}
