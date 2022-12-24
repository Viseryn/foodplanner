<?php

namespace App\Controller;

use App\Repository\IngredientRepository;
use App\Repository\RecipeRepository;
use App\Repository\StorageRepository;
use App\Service\IngredientUtil;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/pantry')]
class PantryController extends AbstractController
{
    /**
     * Pantry API
     *
     * @param IngredientRepository $ingredientRepository
     * @return Response
     */
    #[Route('/', name: 'api_pantry', methods: ['GET'])]
    public function index(
        IngredientRepository $ingredientRepository
    ): Response {
        $ingredients = $ingredientRepository->findBy(['storage' => '1'], ['position' => 'ASC']);

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($ingredients, 'json');

        return (new JsonResponse($jsonContent));
    }

    /**
     * Pantry Update API
     *
     * @param Request $request
     * @param StorageRepository $storageRepository
     * @param IngredientRepository $ingredientRepository
     * @param IngredientUtil $ingredientUtil
     * @return Response
     */
    #[Route('/update', name: 'api_pantry_update', methods: ['GET', 'POST'])]
    public function update(
        Request $request, 
        StorageRepository $storageRepository, 
        IngredientRepository $ingredientRepository, 
        IngredientUtil $ingredientUtil
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Decode request data
        $requestContent = json_decode($request->getContent());

        // Transform data into a string
        $ingredients = '';

        foreach ($requestContent as $ingredient) {
            $ingredients .= $ingredient->name . "\n";
        }

        // Transform data into Ingredient objects
        $newIngredients = $ingredientUtil->ingredientSplit($ingredients);

        // Add position and checked to Ingredient objects
        $i = 0;
        $storage = $storageRepository->find(1);

        foreach ($requestContent as $ingredient) {
            $newIngredients[$i]
                ->setStorage($storage)
                ->setChecked($ingredient->checked)
                ->setPosition($ingredient->position)
            ;

            $i++;
        }

        // Delete old pantry ingredients from database
        $oldIngredients = $ingredientRepository->findBy(['storage' => '1'], ['position' => 'ASC']);
        
        foreach($oldIngredients as $ingredient) {
            $ingredientRepository->remove($ingredient, true);
        }

        // Add new pantry ingredients to the database
        foreach($newIngredients as $ingredient) {
            $ingredientRepository->add($ingredient, true);
        }

        // Empty Response
        return new Response();
    }

    /**
     * Pantry Add API
     *
     * @param Request $request
     * @param RecipeRepository $recipeRepository
     * @param StorageRepository $storageRepository
     * @param IngredientRepository $ingredientRepository
     * @param IngredientUtil $ingredientUtil
     * @return Response
     */
    #[Route('/add', name: 'api_pantry_add', methods: ['GET', 'POST'])]
    public function add(
        Request $request, 
        RecipeRepository $recipeRepository,
        StorageRepository $storageRepository, 
        IngredientRepository $ingredientRepository, 
        IngredientUtil $ingredientUtil
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Decode request data
        $requestContent = json_decode($request->getContent());

        // Collect all ingredients and combine to a string
        $ingredients = '';

        foreach ($requestContent as $recipeData) {
            $recipe = $recipeRepository->find($recipeData->id);
            $ingredients .= $ingredientUtil->ingredientString($recipe->getIngredients());
            $ingredients .= "\n";
        }

        // Transform data into Ingredient objects
        $newIngredients = $ingredientUtil->ingredientSplit($ingredients);

        // Check highest position
        $oldIngredients = $ingredientRepository->findBy(['storage' => '1'], ['position' => 'DESC']);
        $highestPosition = (count($oldIngredients) > 0) ? $oldIngredients[0]->getPosition() : 0;

        // Add position and checked to Ingredient objects
        $i = 0;
        $storage = $storageRepository->find(1);

        foreach ($newIngredients as $ingredient) {
            $newIngredients[$i]
                ->setStorage($storage)
                ->setChecked(false)
                ->setPosition($highestPosition + 1 + $i)
            ;

            $i++;
        }

        // Add new pantry ingredients to the database
        foreach($newIngredients as $ingredient) {
            $ingredientRepository->add($ingredient, true);
        }

        // Empty Response
        return new Response();
    }

    /**
     * Pantry Ingredients API
     *
     * @param Request $request
     * @param StorageRepository $storageRepository
     * @param IngredientRepository $ingredientRepository
     * @param IngredientUtil $ingredientUtil
     * @return Response
     */
    #[Route('/ingredients', name: 'api_pantry_ingredients', methods: ['GET', 'POST'])]
    public function ingredient(
        Request $request, 
        StorageRepository $storageRepository, 
        IngredientRepository $ingredientRepository, 
        IngredientUtil $ingredientUtil
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        
        // Decode request data
        $requestContent = json_decode($request->getContent());

        // Transform data into Ingredient object
        $newIngredient = $ingredientUtil->ingredientSplit($requestContent->name)[0];

        // Check highest position
        $oldIngredients = $ingredientRepository->findBy(['storage' => '1'], ['position' => 'DESC']);
        $highestPosition = (count($oldIngredients) > 0) ? $oldIngredients[0]->getPosition() : 0;

        // Add position and checked to Ingredient object
        $storage = $storageRepository->find(1);
        $newIngredient
            ->setStorage($storage)
            ->setChecked(false)
            ->setPosition($highestPosition + 1)
        ;

        // Add new pantry ingredient to the database
        $ingredientRepository->add($newIngredient, true);

        // Empty Response
        return new Response($newIngredient);
    }
}
