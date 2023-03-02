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
     * 
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @param MealCategoryRepository $mealCategoryRepository
     * @return Response
     * 
     * @todo Move this to utils.
     */
    #[Route('/standard', name: 'api_mealcategories_standard', methods: ['GET', 'POST'])]
    public function updateStandard(
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request, 
        MealCategoryRepository $mealCategoryRepository,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Fetch request content
        $requestContent = json_decode($request->getContent());

        // Update each UserGroup in the database according to the request array
        foreach ($requestContent as $category) {
            // Set this to true when standard is set, so there is only one standard group
            $setStandard = false;

            // Get UserGroup from db
            $categoryDb = $mealCategoryRepository->find($category->id);
            
            if ($category->standard && !$setStandard) {
                $categoryDb->setStandard(true);
                $setStandard = true;
            } else {
                $categoryDb->setStandard(false);
            }

            // Update group in database
            $mealCategoryRepository->add($categoryDb, true);
        }

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }
}
