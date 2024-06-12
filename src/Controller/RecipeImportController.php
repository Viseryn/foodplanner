<?php namespace App\Controller;

use App\Entity\Recipe;
use App\Mapper\RecipeImportMapper;
use App\Repository\RecipeRepository;
use App\Service\DtoResponseService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/import/recipes')]
class RecipeImportController extends AbstractControllerWithMapper {
    public function __construct(
        private readonly RecipeImportMapper $recipeImportMapper,
        private readonly RecipeRepository $recipeRepository,
    ) {
        parent::__construct(Recipe::class);
    }

    #[Route('', name: 'api_import_recipes_post', methods: ['POST'])]
    public function post(Request $request): Response {
        $data = json_decode($request->getContent(), true);

        $recipeExportDtos = (new ArrayCollection($data))
            ->map(fn ($recipeData) => $this->recipeImportMapper->parseRecipeExportDto($recipeData));

        $recipes = $recipeExportDtos
            ->map(fn ($recipeExportDto) => $this->recipeImportMapper->toRecipe($recipeExportDto));

        foreach ($recipes as $recipe) {
            $this->recipeRepository->save($recipe, true);
        }

        $recipeDtos = (new ArrayCollection($recipes->toArray()))
            ->map(fn ($recipe) => $this->mapper->entityToDto($recipe));

        return DtoResponseService::getResponse($recipeDtos);
    }
}
