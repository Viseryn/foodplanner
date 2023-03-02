<?php

namespace App\Controller;

use App\Entity\Meal;
use App\Form\MealType;
use App\Repository\MealRepository;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Meal API
 */
#[Route('/api/meals')]
class MealController extends AbstractController
{
    /**
     * Meal Add API
     * 
     * Adds a new Meal to the database when the form in the Request was submitted. Returns an empty 
     * Response. If no form was submitted, responds with an Error 500.
     *
     * @param MealRepository $mealRepository
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @return Response
     */
    #[Route('/add', name: 'api_meals_add', methods: ['GET', 'POST'])]
    public function add(
        MealRepository $mealRepository,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request, 
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $meal = new Meal();

        $form = $this->createForm(MealType::class, $meal);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $mealRepository->add($meal, true);
            $refreshDataTimestampUtil->updateTimestamp();

            return new Response();
        }

        $response = (new Response())->setStatusCode(500);
        return $response;
    }

    /**
     * Meal Delete API
     * 
     * Deletes the Meal with the given ID and responds with an empty Response.
     *
     * @param Meal $meal
     * @param MealRepository $mealRepository
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/delete/{id}', name: 'api_meals_delete', methods: ['GET'])]
    public function delete(
        Meal $meal, 
        MealRepository $mealRepository,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $mealRepository->remove($meal, true);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }
}
