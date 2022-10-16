<?php

namespace App\Controller;

use App\Entity\Meal;
use App\Form\MealType;
use App\Repository\DayRepository;
use App\Repository\MealRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/planner')]
class PlanController extends AbstractController
{
    #[Route('/', name: 'app_plan_index')]
    public function index(DayRepository $dayRepository): Response
    {
        $days = $dayRepository->findAll();

        return $this->render('plan/index.html.twig', [
            'days' => $days,
        ]);
    }

    /**
     * Controller for adding a new Meal.
     *
     * @param Request $request
     * @param MealRepository $mealRepository
     * @return Response
     */
    #[Route('/new', name: 'app_plan_new', methods: ['GET', 'POST'])]
    public function new(Request $request, MealRepository $mealRepository): Response
    {
        $meal = new Meal();
        $form = $this->createForm(MealType::class, $meal);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $mealRepository->add($meal, true);

            return $this->redirectToRoute('app_plan_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('plan/new_meal.html.twig', [
            'meal' => $meal,
            'form' => $form,
        ]);
    }
}
