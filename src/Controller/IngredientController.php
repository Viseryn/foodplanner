<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Repository\IngredientRepository;
use App\Repository\RecipeRepository;
use App\Repository\StorageRepository;
use App\Service\IngredientUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/ingredient')]
class IngredientController extends AbstractController
{
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
        IngredientUtil $ingredientUtil,
    ): Response {
        $form = $this->createFormBuilder($ingredient)
            ->add('name')
            ->add('quantity', TextType::class, [
                'mapped' => false,
                'required' => false,
                'data' => $ingredient->getQuantity(),
            ])
            ->getForm()
        ;

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Split value and unit of quantity and add to Ingredient
            $quantity = $ingredientUtil->quantitySplit($form['quantity']->getData());
            $ingredient->setQuantity($quantity);

            $ingredientRepository->add($ingredient, true);

            // Redirect to corresponding recipe or storage
            // (TODO) Shopping list
            if ($ingredient->getRecipe()) {
                return $this->redirectToRoute(
                    'app_recipe_show', 
                    ['id' => $ingredient->getRecipe()->getId()], 
                    Response::HTTP_SEE_OTHER
                );
            } elseif ($ingredient->getStorage()) {
                return $this->redirectToRoute('app_storage_index', [], Response::HTTP_SEE_OTHER);
            }
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
    ): Response {
        if ($this->isCsrfTokenValid('delete'.$ingredient->getId(), $request->request->get('_token'))) {
            $ingredientRepository->remove($ingredient, true);
        }
        
        if ($ingredient->getRecipe()) {
            return $this->redirectToRoute(
                'app_recipe_show', 
                ['id' => $ingredient->getRecipe()->getId()], 
                Response::HTTP_SEE_OTHER
            );
        } elseif ($ingredient->getStorage()) {
            return $this->redirectToRoute('app_storage_index', [], Response::HTTP_SEE_OTHER);
        }
    }
}