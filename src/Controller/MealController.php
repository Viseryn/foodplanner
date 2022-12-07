<?php

namespace App\Controller;

use App\Entity\Meal;
use App\Form\MealType;
use App\Repository\MealRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MealController extends AbstractController
{
    /**
     * Meal Add API
     * 
     * Adds a new Meal to the database when the form
     * in the Request was submitted. Returns an empty 
     * Response. If no form was submitted, responds 
     * with an Error 500.
     *
     * @param Request $request
     * @param MealRepository $mealRepository
     * @return Response
     */
    #[Route('/api/meal/add', name: 'app_meal_add', methods: ['GET', 'POST'])]
    public function add(Request $request, MealRepository $mealRepository): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $meal = new Meal();

        $form = $this->createForm(MealType::class, $meal);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $mealRepository->add($meal, true);

            return new Response();
        }

        $response = (new Response())->setStatusCode(500);
        return $response;
    }

    /**
     * Meal Delete API
     * 
     * Deletes the Meal with the given ID and responds
     * with an empty Response.
     *
     * @param Meal $meal
     * @param MealRepository $mealRepository
     * @return Response
     */
    #[Route('/api/meal/{id}/delete', name: 'app_meal_delete', methods: ['GET'])]
    public function delete(Meal $meal, MealRepository $mealRepository): Response
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $mealRepository->remove($meal, true);

        return new Response();
    }
}
