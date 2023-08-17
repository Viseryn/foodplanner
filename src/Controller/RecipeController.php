<?php

namespace App\Controller;

use App\DataTransferObject\DTOSerializer;
use App\DataTransferObject\RecipeDTO;
use App\Entity\Recipe;
use App\Form\RecipeType;
use App\Repository\RecipeRepository;
use App\Service\RecipeControllerService;
use App\Service\RecipeUtil;
use App\Service\RefreshDataTimestampUtil;
use Doctrine\Common\Collections\ArrayCollection;
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

    /**
     * Responds with a list of all Recipe objects.
     */
    #[Route('', name: 'api_recipes_getAll', methods: ['GET'])]
    public function getAll(): Response
    {
        $recipeDTOs = $this->recipeControllerService->getAllRecipes();
        return DTOSerializer::getResponse($recipeDTOs);
    }

    /**
     * Recipe Add API
     * 
     * A Recipe API that adds a new Recipe object to the database when the form in AddRecipe.js was 
     * submitted. Responds with the ID of the newly created Recipe object. If no form was submitted, 
     * responds with an Error 500.
     *
     * @param Request $request
     * @return Response
     */
    #[Route('/add', name: 'api_recipe_add', methods: ['GET', 'POST'])]
    public function add(
        Request $request, 
    ): Response {
        $recipe = new Recipe();

        $form = $this->createForm(RecipeType::class, $recipe);
        $form->handleRequest($request);

        if (!$form->isSubmitted()) {
            return (new Response)->setStatusCode(500);
        }

        $this->recipeRepository->save($recipe, true);
        $this->recipeUtil->update($recipe, $form);

        $this->refreshDataTimestampUtil->updateTimestamp();

        return new Response($recipe->getId());
    }

    /**
     * Recipes Edit API
     * 
     * A Recipe API that edit an existing Recipe object in the database when the form in 
     * EditRecipe.js was submitted. Responds with the ID of the Recipe object. If no form was 
     * submitted, responds with an Error 500.
     * 
     * @param Recipe $recipe
     * @param Request $request
     * @return Response
     */
    #[Route('/edit/{id}', name: 'api_recipes_edit', methods: ['GET', 'POST'])]
    public function edit(
        Recipe $recipe,
        Request $request, 
    ): Response {
        $form = $this->createForm(RecipeType::class, $recipe);
        $form = $this->recipeUtil->prepareEditForm($recipe, $form);
        $form->handleRequest($request);

        if (!$form->isSubmitted()) {
            return (new Response)->setStatusCode(500);
        }

        $this->recipeUtil->update($recipe, $form);
        $this->recipeRepository->save($recipe, true);

        $this->refreshDataTimestampUtil->updateTimestamp();

        return new Response($recipe->getId());
    }

    /**
     * Deletes the given Recipe object and responds with the deleted object.
     */
    #[Route('/{id}', name: 'api_recipes_delete', methods: ['DELETE'])]
    public function delete(Recipe $recipe): Response
    {
        $this->recipeControllerService->removeRecipe($recipe);
        $this->refreshDataTimestampUtil->updateTimestamp();

        return DTOSerializer::getResponse(new RecipeDTO($recipe));
    }
}
