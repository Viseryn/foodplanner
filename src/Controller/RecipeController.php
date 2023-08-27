<?php namespace App\Controller;

use App\DataTransferObject\DTOSerializer;
use App\DataTransferObject\RecipeDTO;
use App\Entity\Recipe;
use App\Form\RecipeType;
use App\Repository\RecipeRepository;
use App\Service\RecipeControllerService;
use App\Service\RecipeUtil;
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
        private RecipeUtil $recipeUtil,
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

    /**
     * @todo PUT method is not working.
     */
    #[Route('/{id}', name: 'api_recipes_put', methods: ['POST'])]
    public function put(Recipe $recipe, Request $request): Response
    {
        $form = $this->createForm(RecipeType::class, $recipe);
        $form = $this->recipeUtil->prepareEditForm($recipe, $form);
        $form->handleRequest($request);

        if (!$form->isSubmitted()) {
            return (new Response)->setStatusCode(400);
        }

        $this->recipeUtil->update($recipe, $form);
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
