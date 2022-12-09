<?php

namespace App\Controller;

use App\Repository\MealCategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use JMS\Serializer\SerializerBuilder;

#[Route('/api/mealcategories')]
class MealCategoryController extends AbstractController
{
    /**
     * MealCategories List API
     * 
     * Responds with an array of MealCategories.
     *
     * @param MealCategoryRepository $mealCategoryRepository
     * @return JsonResponse
     */
    #[Route('/list', name: 'api_mealcategories_list', methods: ['GET'])]
    public function mealCategoriesAPI(MealCategoryRepository $mealCategoryRepository): JsonResponse
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Fetch all MealCategory objects from the database
        $mealCategories = $mealCategoryRepository->findAll();

        // Create array for response
        $mealCategoriesResponse = [];

        // Add public data to the response array
        foreach ($mealCategories as $mealCategory) {
            $mealCategoriesResponse[] = [
                'name' => $mealCategory->getName(),
                'isStandard' => $mealCategory->isStandard(),
                'icon' => $mealCategory->getIcon(),
                'id' => 'mealCategory_' . $mealCategory->getName(),        // For radio buttons
                'value' => $mealCategory->getId(),                         // For radio buttons
                'label' => $mealCategory->getName(),                       // For radio buttons
                'checked' => $mealCategory->isStandard() ? 'checked' : '', // For radio buttons
            ];
        }

        // Serialize data and respond
        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($mealCategoriesResponse, 'json');

        return new JsonResponse($jsonContent);
    }

    /**
     * MealCategories Standard API
     * 
     * Updates the standard MealCategory.
     *
     * @param Request $request
     * @param MealCategoryRepository $mealCategoryRepository
     * @return Response
     */
    #[Route('/standard', name: 'api_mealcategories_standard', methods: ['GET', 'POST'])]
    public function updateStandard(Request $request, MealCategoryRepository $mealCategoryRepository): Response 
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Fetch request content
        $requestContent = json_decode($request->getContent());

        // Update each UserGroup in the database according to the request array
        foreach ($requestContent as $category) {
            // Set this to true when standard is set, so there is only one standard group
            $setStandard = false;

            // Get UserGroup from db
            $categoryDb = $mealCategoryRepository->find($category->value);
            
            if ($category->isStandard && !$setStandard) {
                $categoryDb->setStandard(true);
                $setStandard = true;
            } else {
                $categoryDb->setStandard(false);
            }

            // Update group in database
            $mealCategoryRepository->add($categoryDb, true);
        }

        // Empty response
        return new Response();
    }
}
