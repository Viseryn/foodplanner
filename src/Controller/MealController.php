<?php

namespace App\Controller;

use App\DataTransferObject\DTOSerializer;
use App\DataTransferObject\MealDTO;
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
    public function __construct(
        private MealRepository $mealRepository,
        private RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ) {}

    #[Route('', name: 'api_meals_post', methods: ['POST'])]
    public function post(Request $request): Response
    {
        $meal = new Meal();

        $form = $this->createForm(MealType::class, $meal);
        $form->handleRequest($request);

        if (!$form->isSubmitted()) {
            return (new Response)->setStatusCode(400);
        }

        $this->mealRepository->add($meal, true);
        $this->refreshDataTimestampUtil->updateTimestamp();

        return DTOSerializer::getResponse(new MealDTO($meal));
    }

    #[Route('/{id}', name: 'api_meals_delete', methods: ['DELETE'])]
    public function delete(Meal $meal): Response
    {
        $this->mealRepository->remove($meal, true);
        $this->refreshDataTimestampUtil->updateTimestamp();
        return (new Response)->setStatusCode(204);
    }
}
