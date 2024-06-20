<?php

namespace App\Controller;

use App\DataTransferObject\AddMealRequestDto;
use App\Entity\Meal;
use App\Form\MealType;
use App\Mapper\AddMealRequestMapper;
use App\Repository\MealRepository;
use App\Service\DtoResponseService;
use App\Service\JsonDeserializer;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Meal API
 */
#[Route('/api/meals')]
class MealController extends AbstractControllerWithMapper
{
    public function __construct(
        private readonly AddMealRequestMapper $addMealRequestMapper,
        private readonly MealRepository $mealRepository,
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ) {
        parent::__construct(Meal::class);
    }

    #[Route('', name: 'api_meals_post', methods: ['POST'])]
    public function post(Request $request): Response
    {
        $addMealRequestDto = JsonDeserializer::jsonToDto($request->getContent(), AddMealRequestDto::class);
        $meal = $this->addMealRequestMapper->dtoToEntity($addMealRequestDto);
        $this->mealRepository->add($meal, true);
        $this->refreshDataTimestampUtil->updateTimestamp();
        return DtoResponseService::getResponse($this->mapper->entityToDto($meal));
    }

    #[Route('/{id}', name: 'api_meals_delete', methods: ['DELETE'])]
    public function delete(Meal $meal): Response
    {
        $this->mealRepository->remove($meal, true);
        $this->refreshDataTimestampUtil->updateTimestamp();
        return (new Response)->setStatusCode(204);
    }
}
