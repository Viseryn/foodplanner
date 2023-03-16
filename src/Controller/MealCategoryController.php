<?php

namespace App\Controller;

use App\Repository\MealCategoryRepository;
use App\Service\MealCategoryUtil;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use JMS\Serializer\SerializerBuilder;

/**
 * MealCategory API
 */
#[Route('/api/mealcategories')]
class MealCategoryController extends AbstractController
{
    /**
     * MealCategory List API
     * 
     * Responds with an array of JSON objects matching the type specifications of MealCategoryModel.ts.
     *
     * @param MealCategoryRepository $mealCategoryRepository
     * @return JsonResponse
     */
    #[Route('/list', name: 'api_mealcategories_list', methods: ['GET'])]
    public function list(
        MealCategoryRepository $mealCategoryRepository, 
        MealCategoryUtil $mealCategoryUtil,
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $mealCategories = $mealCategoryRepository->findAll();

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($mealCategoryUtil->getApiModels($mealCategories), 'json');

        return new JsonResponse($jsonContent);
    }

    /**
     * MealCategory Standard API
     * 
     * Updates the standard MealCategory. 
     * The request data should be an array of MealCategoryModel JSON objects.
     * 
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @param MealCategoryUtil $mealCategoryUtil
     * @return Response
     */
    #[Route('/standard', name: 'api_mealcategories_standard', methods: ['GET', 'POST'])]
    public function updateStandard(
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request, 
        MealCategoryUtil $mealCategoryUtil,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = json_decode($request->getContent());
        $mealCategoryUtil->updateStandard($requestContent);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }
}
