<?php

namespace App\Controller;

use App\Entity\Recipe;
use App\Form\RecipeType;
use App\Repository\InstructionRepository;
use App\Repository\RecipeRepository;
use App\Service\InstructionUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/recipe')]
class RecipeController extends AbstractController
{
    #[Route('/', name: 'app_recipe_index', methods: ['GET'])]
    public function index(RecipeRepository $recipeRepository): Response
    {
        return $this->render('recipe/index.html.twig', [
            'recipes' => $recipeRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_recipe_new', methods: ['GET', 'POST'])]
    public function new(Request $request, RecipeRepository $recipeRepository): Response
    {
        $recipe = new Recipe();
        $form = $this->createForm(RecipeType::class, $recipe);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $recipeRepository->add($recipe, true);

            return $this->redirectToRoute(
                'app_recipe_show', 
                ['id' => $recipe->getId()], 
                Response::HTTP_SEE_OTHER
            );
        }

        return $this->renderForm('recipe/new.html.twig', [
            'recipe' => $recipe,
            'form' => $form,
        ]);
    }

    /**
     * Controller for showing a Recipe.
     *
     * @param Recipe $recipe
     * @return Response
     */
    #[Route('/{id}', name: 'app_recipe_show', methods: ['GET'])]
    public function show(Recipe $recipe): Response
    {
        return $this->render('recipe/show.html.twig', [
            'recipe' => $recipe,
        ]);
    }

    /**
     * Controller for editing a Recipe, 
     * including its instructions.
     *
     * @param Request $request
     * @param Recipe $recipe
     * @param RecipeRepository $recipeRepository
     * @param InstructionUtil $instructionUtil
     * @param InstructionRepository $instructionRepository
     * @return Response
     */
    #[Route('/{id}/edit', name: 'app_recipe_edit', methods: ['GET', 'POST'])]
    public function edit(
        Request $request, 
        Recipe $recipe, 
        RecipeRepository $recipeRepository,
        InstructionUtil $instructionUtil,
        InstructionRepository $instructionRepository,
    ): Response
    {
        // Get all instructions for the recipe
        $instructions = $recipe->getInstructions();
        $instructionString = $instructionUtil->instructionString($instructions);

        // Build form
        $form = $this->createForm(RecipeType::class, $recipe);
        $form->add('instructions', TextareaType::class, [
            'required' => false,
            'mapped' => false,
            'data' => $instructionString,
        ]);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Delete old instructions
            foreach ($instructions as $inst) {
                $instructionRepository->remove($inst, true);
            }

            // Split instructions and add to database
            $newInstructions = $instructionUtil->instructionSplit($form['instructions']->getData());
            foreach ($newInstructions as $inst) {
                $inst->setRecipe($recipe);
                $instructionRepository->add($inst, true);
            }

            $recipeRepository->add($recipe, true);

            return $this->redirectToRoute(
                'app_recipe_show', 
                ['id' => $recipe->getId()], 
                Response::HTTP_SEE_OTHER
            );
        }

        return $this->renderForm('recipe/edit.html.twig', [
            'recipe' => $recipe,
            'form' => $form,
        ]);
    }

    /**
     * Controller for deleting a Recipe.
     *
     * @param Request $request
     * @param Recipe $recipe
     * @param RecipeRepository $recipeRepository
     * @return Response
     */
    #[Route('/{id}', name: 'app_recipe_delete', methods: ['POST'])]
    public function delete(Request $request, Recipe $recipe, RecipeRepository $recipeRepository): Response
    {
        if ($this->isCsrfTokenValid('delete'.$recipe->getId(), $request->request->get('_token'))) {
            $recipeRepository->remove($recipe, true);
        }

        return $this->redirectToRoute('app_recipe_index', [], Response::HTTP_SEE_OTHER);
    }

    /**
     * Renders the number of recipes for the sidebar.
     *
     * @param RecipeRepository $recipeRepository
     * @return Response
     */
    public function numberOfRecipes(RecipeRepository $recipeRepository): Response 
    {
        return $this->render('sidebar/_number_of_recipes.html.twig', [
            'numberOfRecipes' => count($recipeRepository->findAll()),
        ]);
    }
}
