<?php

namespace App\Controller;

use App\Entity\Recipe;
use App\Form\RecipeType;
use App\Repository\IngredientRepository;
use App\Repository\InstructionRepository;
use App\Repository\MealRepository;
use App\Repository\RecipeRepository;
use App\Service\IngredientUtil;
use App\Service\InstructionUtil;
use App\Service\RecipeUtil;
use App\Service\RefreshDataTimestampUtil;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
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
     * Fetches all Recipes and responds with a JSON
     * array containing all Recipe data.
     *
     * @param RecipeRepository $recipeRepository
     * @return Response
     */
    #[Route('/list', name: 'api_recipes_list', methods: ['GET'])]
    public function list(RecipeRepository $recipeRepository): Response
    {
        $recipes = $recipeRepository->findBy([], ['title' => 'ASC']);

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($recipes, 'json');

        return (new JsonResponse($jsonContent));
    }

    /**
     * Recipe Add API
     * 
     * A Recipe API that adds a new Recipe object to the
     * database when the form in AddRecipe.js was submitted.
     * Responds with the ID of the newly created Recipe 
     * object. If no form was submitted, responds with an
     * Error 500.
     * 
     * Expected RequestContent:
     *     AddRecipe.js form
     * 
     * Expected ResponseData Type:
     *     int: Id of new Recipe
     *
     * @param Request $request
     * @param RecipeRepository $recipeRepository
     * @param RecipeUtil $recipeUtil
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/add', name: 'api_recipe_add', methods: ['GET', 'POST'])]
    public function add(
        Request $request, 
        RecipeRepository $recipeRepository,
        RecipeUtil $recipeUtil,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // The new Recipe object will automatically be 
        // validated and set up by the Form.
        $recipe = new Recipe();

        $form = $this->createForm(RecipeType::class, $recipe);
        $form->handleRequest($request);

        // Send Error 500 if form was not submitted.
        if (!$form->isSubmitted()) {
            return (new Response)->setStatusCode(500);
        }

        // If form was submitted, add Recipe to database
        $recipeRepository->save($recipe, true);
        $recipeUtil->update($recipe, $form);

        // Update Refresh Data Timestamp
        $refreshDataTimestampUtil->updateTimestamp();

        // Respond with new Id
        return new Response($recipe->getId());
    }

    /**
     * Recipes Edit API
     * 
     * Edits an existing Recipe when the form 
     * in the Request was submitted. Responds with the 
     * ID of the new Recipe. If no form was submitted, 
     * responds with an Error 500.
     * 
     * @param Request $request
     * @param Recipe $recipe
     * @param RecipeRepository $recipeRepository
     * @param IngredientRepository $ingredientRepository
     * @param InstructionRepository $instructionRepository
     * @param IngredientUtil $ingredientUtil
     * @param InstructionUtil $instructionUtil
     * @return Response
     */
    #[Route('/edit/{id}', name: 'api_recipes_edit', methods: ['GET', 'POST'])]
    public function edit(
        Request $request, 
        Recipe $recipe, 
        RecipeRepository $recipeRepository,
        IngredientUtil $ingredientUtil,
        InstructionUtil $instructionUtil,
        RecipeUtil  $recipeUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $form = $this
            ->createForm(RecipeType::class, $recipe)
            ->add('ingredients', TextareaType::class, [
                'required' => false,
                'mapped' => false,
                'data' => $ingredientUtil->ingredientString($recipe->getIngredients()),
            ])
            ->add('instructions', TextareaType::class, [
                'required' => false,
                'mapped' => false,
                'data' => $instructionUtil->instructionString($recipe->getInstructions()),
            ])
            ->add('image_remove', CheckboxType::class, [
                'required' => false,
                'mapped' => false,
            ])
        ;

        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $recipeUtil->update($recipe, $form);
            $recipeRepository->add($recipe, true);

            return new JsonResponse([
                'id' => $recipe->getId()
            ]);
        }

        $response = (new Response())->setStatusCode(500);
        return $response;
    }

    /**
     * Recipes Delete API
     * 
     * Deletes the Recipe with the given ID and responds
     * with an empty Response.
     *
     * @param Request $request
     * @param Recipe $recipe
     * @param MealRepository $mealRepository
     * @param RecipeRepository $recipeRepository
     * @return Response
     */
    #[Route('/delete/{id}', name: 'api_recipes_delete', methods: ['GET'])]
    public function delete(Recipe $recipe, MealRepository $mealRepository, RecipeRepository $recipeRepository): Response
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        
        // Get all meals for that recipe
        $meals = $mealRepository->findBy(['recipe' => $recipe->getId()]);

        // Delete all meals first
        foreach ($meals as $meal) {
            $mealRepository->remove($meal, true);
        }

        // Delete recipe
        $recipeRepository->remove($recipe, true);

        return new Response();
    }
}
