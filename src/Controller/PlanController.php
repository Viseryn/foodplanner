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
    #[Route('/new/{dayId}', name: 'app_plan_new_for_day', methods: ['GET', 'POST'], requirements: ['dayId' => '\d+'])]
    public function new(
        Request $request, 
        MealRepository $mealRepository, 
        DayRepository $dayRepository,
        int $dayId = 0
    ): Response {
        $meal = new Meal();

        // Find day by $dayId and push to $meal
        $day = $dayRepository->find($dayId);
        $meal->setDay($day);

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
