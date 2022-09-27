<?php

namespace App\Controller;

use App\Entity\Instruction;
use App\Entity\Recipe;
use App\Form\InstructionType;
use App\Repository\InstructionRepository;
use App\Repository\RecipeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/instruction')]
class InstructionController extends AbstractController
{
    #[Route('/', name: 'app_instruction_index', methods: ['GET'])]
    public function index(InstructionRepository $instructionRepository): Response
    {
        return $this->render('instruction/index.html.twig', [
            'instructions' => $instructionRepository->findAll(),
        ]);
    }

    #[Route('/new/recipe={id}', name: 'app_instruction_new_for_recipe', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function new(
        Request $request, 
        int $id = 0, 
        InstructionRepository $instructionRepository, 
        RecipeRepository $recipeRepository
    ): Response
    {
        $instruction = new Instruction();
        $form = $this->createForm(InstructionType::class, $instruction);

        // Get recipe from id.
        // If recipe exists, set default value for the recipe form field.
        $recipe = $recipeRepository->find($id);
        $form->get('recipe')->setData($recipe);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $instructionRepository->add($instruction, true);

            return $this->redirectToRoute('app_recipe_show', ['id' => $id], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('instruction/new.html.twig', [
            'instruction' => $instruction,
            'form' => $form,
            'recipe' => $recipe,
        ]);
    }

    #[Route('/{id}', name: 'app_instruction_show', methods: ['GET'])]
    public function show(Instruction $instruction): Response
    {
        return $this->render('instruction/show.html.twig', [
            'instruction' => $instruction,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_instruction_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Instruction $instruction, InstructionRepository $instructionRepository): Response
    {
        $form = $this->createForm(InstructionType::class, $instruction);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $instructionRepository->add($instruction, true);

            return $this->redirectToRoute('app_instruction_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('instruction/edit.html.twig', [
            'instruction' => $instruction,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_instruction_delete', methods: ['POST'])]
    public function delete(Request $request, Instruction $instruction, InstructionRepository $instructionRepository): Response
    {
        if ($this->isCsrfTokenValid('delete'.$instruction->getId(), $request->request->get('_token'))) {
            $instructionRepository->remove($instruction, true);
        }

        return $this->redirectToRoute('app_instruction_index', [], Response::HTTP_SEE_OTHER);
    }
}
