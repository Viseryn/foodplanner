<?php

namespace App\Controller;

use App\Entity\Recipe;
use App\Form\RecipeType;
use App\Repository\MealRepository;
use App\Repository\RecipeRepository;
use App\Service\RecipeUtil;
use App\Service\RefreshDataTimestampUtil;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Recipe API
 */
#[Route('/api/recipes')]
class RecipeController extends AbstractController
{
    /**
     * Recipe List API
     * 
     * Responds with an array of JSON objects matching the type specifications of RecipeModel.ts.
     *
     * @param RecipeRepository $recipeRepository
     * @param RecipeUtil $recipeUtil
     * @return Response
     */
    #[Route('/list', name: 'api_recipes_list', methods: ['GET'])]
    public function list(RecipeRepository $recipeRepository, RecipeUtil $recipeUtil): Response
    {
        $recipesResult = $recipeRepository->findBy([], ['title' => 'ASC']);

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($recipeUtil->getApiModels($recipesResult), 'json');

        return (new JsonResponse($jsonContent));
    }

    /**
     * Recipe Add API
     * 
     * A Recipe API that adds a new Recipe object to the database when the form in AddRecipe.js was 
     * submitted. Responds with the ID of the newly created Recipe object. If no form was submitted, 
     * responds with an Error 500.
     *
     * @param RecipeRepository $recipeRepository
     * @param RecipeUtil $recipeUtil
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @return Response
     */
    #[Route('/add', name: 'api_recipe_add', methods: ['GET', 'POST'])]
    public function add(
        RecipeRepository $recipeRepository,
        RecipeUtil $recipeUtil,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request, 
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $recipe = new Recipe();

        $form = $this->createForm(RecipeType::class, $recipe);
        $form->handleRequest($request);

        if (!$form->isSubmitted()) {
            return (new Response)->setStatusCode(500);
        }

        $recipeRepository->save($recipe, true);
        $recipeUtil->update($recipe, $form);

        $refreshDataTimestampUtil->updateTimestamp();

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
     * @param RecipeRepository $recipeRepository
     * @param RecipeUtil $recipeUtil
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @return Response
     */
    #[Route('/edit/{id}', name: 'api_recipes_edit', methods: ['GET', 'POST'])]
    public function edit(
        Recipe $recipe, 
        RecipeRepository $recipeRepository,
        RecipeUtil  $recipeUtil,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request, 
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $form = $this->createForm(RecipeType::class, $recipe);
        $form = $recipeUtil->prepareEditForm($recipe, $form);
        $form->handleRequest($request);

        if (!$form->isSubmitted()) {
            return (new Response)->setStatusCode(500);
        }

        $recipeUtil->update($recipe, $form);
        $recipeRepository->save($recipe, true);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response($recipe->getId());
    }

    /**
     * Recipes Delete API
     * 
     * Deletes the Recipe object with the given ID.
     *
     * @param MealRepository $mealRepository
     * @param Recipe $recipe
     * @param RecipeRepository $recipeRepository
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/delete/{id}', name: 'api_recipes_delete', methods: ['GET'])]
    public function delete(
        MealRepository $mealRepository, 
        Recipe $recipe, 
        RecipeRepository $recipeRepository,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        
        $meals = $mealRepository->findBy(['recipe' => $recipe->getId()]);
        
        foreach ($meals as $meal) {
            $mealRepository->remove($meal, true);
        }

        $recipeRepository->remove($recipe, true);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }
}
