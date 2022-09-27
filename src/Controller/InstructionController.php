<?php

namespace App\Controller;

use App\Entity\Instruction;
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
    /**
     * Controller for adding an Instruction to a Recipe.
     *
     * @param Request $request
     * @param integer $recipeId
     * @param InstructionRepository $instructionRepository
     * @param RecipeRepository $recipeRepository
     * @return Response
     */
    #[Route('/new', name: 'app_instruction_new', methods: ['GET', 'POST'])]
    #[Route('/new/recipe={recipeId}', name: 'app_instruction_new_for_recipe', methods: ['GET', 'POST'], requirements: ['recipeId' => '\d+'])]
    public function new(
        Request $request, 
        int $recipeId = 0, 
        InstructionRepository $instructionRepository, 
        RecipeRepository $recipeRepository
    ): Response
    {
        $instruction = new Instruction();
        $form = $this->createForm(InstructionType::class, $instruction);

        // Get recipe from id.
        // If recipe exists, set default value for the recipe form field.
        $recipe = $recipeRepository->find($recipeId);
        $form->get('recipe')->setData($recipe);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $instructionRepository->add($instruction, true);

            return $this->redirectToRoute('app_recipe_show', ['id' => $recipe->getId()], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('instruction/new.html.twig', [
            'instruction' => $instruction,
            'form' => $form,
            'recipe' => $recipe,
        ]);
    }

    /**
     * Controller for editing an Instruction.
     *
     * @param Request $request
     * @param Instruction $instruction
     * @param InstructionRepository $instructionRepository
     * @return Response
     */
    #[Route('/{id}/edit', name: 'app_instruction_edit', methods: ['GET', 'POST'])]
    public function edit(
        Request $request, 
        Instruction $instruction, 
        InstructionRepository $instructionRepository,
    ): Response
    {
        $form = $this->createForm(InstructionType::class, $instruction);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $instructionRepository->add($instruction, true);

            return $this->redirectToRoute(
                'app_recipe_show', 
                ['id' => $instruction->getRecipe()->getId()], 
                Response::HTTP_SEE_OTHER
            );
        }

        return $this->renderForm('instruction/edit.html.twig', [
            'instruction' => $instruction,
            'form' => $form,
        ]);
    }

    /**
     * Controller for deleting an Instruction.
     *
     * @param Request $request
     * @param Instruction $instruction
     * @param InstructionRepository $instructionRepository
     * @return Response
     */
    #[Route('/{id}', name: 'app_instruction_delete', methods: ['POST'])]
    public function delete(
        Request $request, 
        Instruction $instruction, 
        InstructionRepository $instructionRepository
    ): Response
    {
        if ($this->isCsrfTokenValid('delete'.$instruction->getId(), $request->request->get('_token'))) {
            $instructionRepository->remove($instruction, true);
        }

        return $this->redirectToRoute(
            'app_recipe_show', 
            ['id' => $instruction->getRecipe()->getId()], 
            Response::HTTP_SEE_OTHER
        );
    }
}
