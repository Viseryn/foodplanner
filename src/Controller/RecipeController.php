<?php namespace App\Controller;

use App\DataTransferObject\ImageDTO;
use App\Entity\Recipe;
use App\Repository\RecipeRepository;
use App\Service\DtoResponseService;
use App\Service\JsonDeserializer;
use App\Service\RecipeControllerService;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Recipe API
 */
#[Route('/api/recipes')]
class RecipeController extends AbstractControllerWithMapper
{
    public function __construct(
        private readonly RecipeControllerService $recipeControllerService,
        private readonly RecipeRepository $recipeRepository,
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ) {
        parent::__construct(Recipe::class);
    }

    #[Route('', name: 'api_recipes_getAll', methods: ['GET'])]
    public function getAll(): Response
    {
        $recipeDTOs = $this->recipeControllerService->getAllRecipes();
        return DtoResponseService::getResponse($recipeDTOs);
    }

    #[Route('', name: 'api_recipe_post', methods: ['POST'])]
    public function post(Request $request): Response
    {
        $recipe = JsonDeserializer::jsonToEntity($request->getContent(), Recipe::class);
        $this->recipeRepository->save($recipe, true);

        $this->refreshDataTimestampUtil->updateTimestamp();
        return DtoResponseService::getResponse($this->mapper->entityToDto($recipe));
    }

    /** @todo PUT method is not working. */
    #[Route('/{id}', name: 'api_recipes_put', methods: ['POST'])]
    public function put(Recipe $recipe, Request $request): Response
    {
        $newRecipe = JsonDeserializer::jsonToEntity($request->getContent(), Recipe::class);

        $recipe->setTitle($newRecipe->getTitle())
               ->setPortionSize($newRecipe->getPortionSize());
        foreach ($recipe->getIngredients() as $ingredient) {
            $recipe->removeIngredient($ingredient);
        }
        foreach ($recipe->getInstructions() as $instruction) {
            $recipe->removeInstruction($instruction);
        }
        foreach ($newRecipe->getIngredients() as $ingredient) {
            $recipe->addIngredient($ingredient);
        }
        foreach ($newRecipe->getInstructions() as $instruction) {
            $recipe->addInstruction($instruction);
        }
        $this->recipeRepository->save($recipe, true);

        $this->refreshDataTimestampUtil->updateTimestamp();
        return DtoResponseService::getResponse($this->mapper->entityToDto($recipe));
    }

    /**
     * This PATCH API is only usable for updating or removing the recipe's image.
     * It expects a JSON object of type ImageUploadModel.
     */
    #[Route('/{id}/image', name: 'api_recipes_patch', methods: ['PATCH'])]
    public function patch(Recipe $recipe, Request $request): Response
    {
        $imageDto = JsonDeserializer::jsonToDto($request->getContent(), ImageDTO::class);
        $this->recipeControllerService->updateRecipeImage($recipe, $imageDto);
        $this->recipeRepository->save($recipe, true);
        $this->refreshDataTimestampUtil->updateTimestamp();
        return DtoResponseService::getResponse($this->mapper->entityToDto($recipe));
    }

    #[Route('/{id}', name: 'api_recipes_delete', methods: ['DELETE'])]
    public function delete(Recipe $recipe): Response
    {
        $this->recipeControllerService->removeRecipe($recipe);
        $this->refreshDataTimestampUtil->updateTimestamp();

        return DtoResponseService::getResponse($this->mapper->entityToDto($recipe));
    }
}
