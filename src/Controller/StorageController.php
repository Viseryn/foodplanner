<?php

namespace App\Controller;

use App\Repository\IngredientRepository;
use App\Repository\StorageRepository;
use App\Service\IngredientUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/storage')]
class StorageController extends AbstractController
{
    #[Route('/', name: 'app_storage_index', methods: ['GET'])]
    public function index(IngredientRepository $ingredientRepository): Response
    {
        return $this->render('storage/index.html.twig', [
            'ingredients' => $ingredientRepository->findStorageIngredients(),
        ]);
    }

    /**
     * 
     */
    #[Route('/edit/ingredients', name: 'app_storage_edit_ingredients', methods: ['GET', 'POST'])]
    public function editAll(
        Request $request,
        StorageRepository $storageRepository,
        IngredientRepository $ingredientRepository,
        IngredientUtil $ingredientUtil,
    ): Response {
        $storage = $storageRepository->find(1);

        $ingredients = $storage->getIngredients();
        $ingredientString = $ingredientUtil->ingredientString($ingredients);

        $form = $this->createFormBuilder()
            ->add('ingredients', TextareaType::class, [
                'required' => false,
                'mapped' => false,
                'data' => $ingredientString,
            ])
            ->getForm()
        ;

        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            // Check if ingredients were changed
            if ($ingredientString !== $form['ingredients']->getData()) {
                // Delete old ingredients
                foreach ($ingredients as $ing) {
                    $ingredientRepository->remove($ing, true);
                }

                // Split ingredients and add to database
                $newIngredients = $ingredientUtil->ingredientSplit($form['ingredients']->getData());
                foreach ($newIngredients as $ing) {
                    $ing->setStorage($storage);
                    $ingredientRepository->add($ing, true);
                }
            }

            $storageRepository->add($storage, true);

            // Redirect to corresponding storage
            return $this->redirectToRoute('app_storage_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('storage/editIngredients.html.twig', [
            'storage' => $storage,
            'form' => $form,
        ]);
    }
}
