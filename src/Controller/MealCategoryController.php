<?php

namespace App\Controller;

use App\Repository\MealCategoryRepository;
use App\Repository\UserGroupRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use JMS\Serializer\SerializerBuilder;

class MealCategoryController extends AbstractController
{
    /**
     * MealCategory API
     * 
     * Responds with an array of MealCategories.
     *
     * @param MealCategoryRepository $mealCategoryRepository
     * @return JsonResponse
     */
    #[Route('/api/mealcategories', name: 'app_api_mealcategories', methods: ['GET'])]
    public function mealCategoriesAPI(MealCategoryRepository $mealCategoryRepository): JsonResponse
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_USER');

        // Fetch all MealCategory objects from the database
        $mealCategories = $mealCategoryRepository->findAll();

        // Serialize data and respond
        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($mealCategories, 'json');

        return new JsonResponse($jsonContent);
    }

    /**
     * MealCategory Update Standard API
     * 
     * Updates the standard MealCategory 
     *
     * @param Request $request
     * @param MealCategoryRepository $mealCategoryRepository
     * @return Response
     */
    #[Route('/api/mealcategories/update-standard', name: 'app_api_mealcategories_update_standard', methods: ['GET', 'POST'])]
    public function updateStandard(Request $request, MealCategoryRepository $mealCategoryRepository): Response 
    {
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

        // Empty response
        return new Response();
    }
}
