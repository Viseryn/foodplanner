<?php namespace App\Controller;

use App\DataTransferObject\DTOSerializer;
use App\DataTransferObject\RecipeDTO;
use App\Entity\Recipe;
use App\Repository\RecipeRepository;
use App\Service\RecipeControllerService;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Recipe API
 */
#[Route('/api/recipes')]
class RecipeController extends AbstractController
{
    public function __construct(
        private RecipeControllerService $recipeControllerService,
        private RecipeRepository $recipeRepository,
        private RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ) {}

    #[Route('', name: 'api_recipes_getAll', methods: ['GET'])]
    public function getAll(): Response
    {
        $recipeDTOs = $this->recipeControllerService->getAllRecipes();
        return DTOSerializer::getResponse($recipeDTOs);
    }

    #[Route('', name: 'api_recipe_post', methods: ['POST'])]
    public function post(Request $request): Response
    {
        $data = json_decode($request->getContent(), false);
        $recipe = $this->recipeControllerService->mapRecipeModelToEntity($data);
        $this->recipeRepository->save($recipe, true);

        $this->refreshDataTimestampUtil->updateTimestamp();
        return DTOSerializer::getResponse(new RecipeDTO($recipe));
    }

    /** @todo PUT method is not working.
     * @todo Image Remove
     */
    #[Route('/{id}', name: 'api_recipes_put', methods: ['POST'])]
    public function put(Recipe $recipe, Request $request): Response
    {
        $data = json_decode($request->getContent(), false);
        $newRecipe = $this->recipeControllerService->mapRecipeModelToEntity($data);

        $recipe->setTitle($newRecipe->getTitle())
               ->setPortionSize($newRecipe->getPortionSize())
               ->setImage($newRecipe->getImage());
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
        return DTOSerializer::getResponse(new RecipeDTO($recipe));
    }

    #[Route('/{id}', name: 'api_recipes_delete', methods: ['DELETE'])]
    public function delete(Recipe $recipe): Response
    {
        $this->recipeControllerService->removeRecipe($recipe);
        $this->refreshDataTimestampUtil->updateTimestamp();

        return DTOSerializer::getResponse(new RecipeDTO($recipe));
    }
}
