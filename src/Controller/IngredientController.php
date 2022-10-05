<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Repository\IngredientRepository;
use App\Repository\RecipeRepository;
use App\Repository\StorageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/ingredient')]
class IngredientController extends AbstractController
{
    /**
     * Controller for adding a new Ingredient to either a 
     * Recipe object or a Storage object.
     *
     * @param Request $request
     * @param IngredientRepository $ingredientRepository
     * @param RecipeRepository $recipeRepository
     * @param StorageRepository $storageRepository
     * @param integer $recipeId
     * @param integer $storageId
     * @return Response
     */
    #[Route('/new/recipe={recipeId}', name: 'app_ingredient_new_for_recipe', methods: ['GET', 'POST'], requirements: ['recipeId' => '\d+'])]
    #[Route('/new/storage={storageId}', name: 'app_ingredient_new_for_storage', methods: ['GET', 'POST'], requirements: ['storageId' => '\d+'])]
    public function new(
        Request $request, 
        IngredientRepository $ingredientRepository, 
        RecipeRepository $recipeRepository,
        StorageRepository $storageRepository,
        int $recipeId = 0,
        int $storageId = 0, 
    ): Response
    {
        // Build form for new Ingredient
        $ingredient = new Ingredient();
        $form = $this->createFormBuilder($ingredient)
            ->add('name')
            ->add('quantityValue')
            ->add('quantityUnit')
            ->getForm();

        // Find recipe or storage by $recipeId or $storageId
        $recipe = $recipeRepository->find($recipeId);
        $storage = $storageRepository->find($storageId);

        // Throw Error 404 if recipe or storage does not exist
        if($recipe === null && $storage === null) {
            if($recipeId > 0) 
                throw $this->createNotFoundException('Recipe does not exist.');
            elseif($storageId > 0) 
                throw $this->createNotFoundException('Storage does not exist.');
        }
        
        // Add recipe or storage to the Ingredient
        $ingredient->setRecipe($recipe)->setStorage($storage);

        // Handle requests
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $ingredientRepository->add($ingredient, true);

            // Redirect to corresponding recipe or storage
            // (TODO) Shopping list
            if($recipe !== null)
                return $this->redirectToRoute(
                    'app_recipe_show', 
                    ['id' => $recipe->getId()], 
                    Response::HTTP_SEE_OTHER
                );
            elseif($storage !== null)
                return $this->redirectToRoute('app_storage_index', [], Response::HTTP_SEE_OTHER);
        }

        // Render page
        return $this->renderForm('ingredient/new.html.twig', [
            'ingredient' => $ingredient,
            'form' => $form,
        ]);
    }

    /**
     * Controller for editing an Ingredient.
     *
     * @param Request $request
     * @param Ingredient $ingredient
     * @param IngredientRepository $ingredientRepository
     * @return Response
     */
    #[Route('/{id}/edit', name: 'app_ingredient_edit', methods: ['GET', 'POST'])]
    public function edit(
        Request $request, 
        Ingredient $ingredient, 
        IngredientRepository $ingredientRepository,
    ): Response
    {
        $form = $this->createFormBuilder($ingredient)
            ->add('name')
            ->add('quantityValue')
            ->add('quantityUnit')
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $ingredientRepository->add($ingredient, true);

            // Redirect to corresponding recipe or storage
            // (TODO) Shopping list
            if($ingredient->getRecipe())
                return $this->redirectToRoute(
                    'app_recipe_show', 
                    ['id' => $ingredient->getRecipe()->getId()], 
                    Response::HTTP_SEE_OTHER
                );
            elseif($ingredient->getStorage())
                return $this->redirectToRoute('app_storage_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('ingredient/edit.html.twig', [
            'ingredient' => $ingredient,
            'form' => $form,
        ]);
    }

    /**
     * Controller for deleting an Ingredient.
     *
     * @param Request $request
     * @param Ingredient $ingredient
     * @param IngredientRepository $ingredientRepository
     * @return Response
     */
    #[Route('/{id}', name: 'app_ingredient_delete', methods: ['POST'])]
    public function delete(
        Request $request, 
        Ingredient $ingredient, 
        IngredientRepository $ingredientRepository,
    ): Response
    {
        if ($this->isCsrfTokenValid('delete'.$ingredient->getId(), $request->request->get('_token'))) {
            $ingredientRepository->remove($ingredient, true);
        }
        
        if($ingredient->getRecipe())
            return $this->redirectToRoute(
                'app_recipe_show', 
                ['id' => $ingredient->getRecipe()->getId()], 
                Response::HTTP_SEE_OTHER
            );
        elseif($ingredient->getStorage())
            return $this->redirectToRoute('app_storage_index', [], Response::HTTP_SEE_OTHER);
    }
}