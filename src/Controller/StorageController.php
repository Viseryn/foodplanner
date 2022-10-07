<?php

namespace App\Controller;

use App\Repository\IngredientRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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
}

//     #[Route('/new', name: 'app_storage_new', methods: ['GET', 'POST'])]
//     public function new(Request $request, StorageRepository $storageRepository): Response
//     {
//         $storage = new Storage();
//         $form = $this->createForm(StorageType::class, $storage);
//         $form->handleRequest($request);

//         if ($form->isSubmitted() && $form->isValid()) {
//             $storageRepository->add($storage, true);

//             return $this->redirectToRoute('app_storage_index', [], Response::HTTP_SEE_OTHER);
//         }

//         return $this->renderForm('storage/new.html.twig', [
//             'storage' => $storage,
//             'form' => $form,
//         ]);
//     }

//     #[Route('/{id}', name: 'app_storage_show', methods: ['GET'])]
//     public function show(Storage $storage): Response
//     {
//         return $this->render('storage/show.html.twig', [
//             'storage' => $storage,
//         ]);
//     }

//     #[Route('/{id}/edit', name: 'app_storage_edit', methods: ['GET', 'POST'])]
//     public function edit(Request $request, Storage $storage, StorageRepository $storageRepository): Response
//     {
//         $form = $this->createForm(StorageType::class, $storage);
//         $form->handleRequest($request);

//         if ($form->isSubmitted() && $form->isValid()) {
//             $storageRepository->add($storage, true);

//             return $this->redirectToRoute('app_storage_index', [], Response::HTTP_SEE_OTHER);
//         }

//         return $this->renderForm('storage/edit.html.twig', [
//             'storage' => $storage,
//             'form' => $form,
//         ]);
//     }

//     #[Route('/{id}', name: 'app_storage_delete', methods: ['POST'])]
//     public function delete(Request $request, Storage $storage, StorageRepository $storageRepository): Response
//     {
//         if ($this->isCsrfTokenValid('delete'.$storage->getId(), $request->request->get('_token'))) {
//             $storageRepository->remove($storage, true);
//         }

//         return $this->redirectToRoute('app_storage_index', [], Response::HTTP_SEE_OTHER);
//     }
// }
