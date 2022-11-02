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

class ShoppingListController extends AbstractController
{
    #[Route('/api/shoppinglist', name: 'app_shoppinglist', methods: ['GET'])]
    public function index(IngredientRepository $ingredientRepository): Response
    {
        $ingredients = $ingredientRepository->findBy(['storage' => '2'], ['position' => 'ASC']);

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($ingredients, 'json');

        return (new JsonResponse($jsonContent));
    }

    #[Route('/api/shoppinglist/update', name: 'app_shoppinglist_update', methods: ['GET', 'POST'])]
    public function update(
        Request $request, 
        StorageRepository $storageRepository, 
        IngredientRepository $ingredientRepository, 
        IngredientUtil $ingredientUtil
    ): Response {
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
        $storage = $storageRepository->find(2);

        foreach ($requestContent as $ingredient) {
            $newIngredients[$i]
                ->setStorage($storage)
                ->setChecked($ingredient->checked)
                ->setPosition($ingredient->position)
            ;

            $i++;
        }

        // Delete old shopping list ingredients from database
        $oldIngredients = $ingredientRepository->findBy(['storage' => '2'], ['position' => 'ASC']);
        
        foreach($oldIngredients as $ingredient) {
            $ingredientRepository->remove($ingredient, true);
        }

        // Add new shopping list ingredients to the database
        foreach($newIngredients as $ingredient) {
            $ingredientRepository->add($ingredient, true);
        }

        // Empty Response
        return new Response();
    }

    #[Route('/api/shoppinglist/add', name: 'app_shoppinglist_add', methods: ['GET', 'POST'])]
    public function add(
        Request $request, 
        RecipeRepository $recipeRepository,
        StorageRepository $storageRepository, 
        IngredientRepository $ingredientRepository, 
        IngredientUtil $ingredientUtil
    ): Response {
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
        $oldIngredients = $ingredientRepository->findBy(['storage' => '2'], ['position' => 'DESC']);
        $highestPosition = $oldIngredients[0]->getPosition();

        // Add position and checked to Ingredient objects
        $i = 0;
        $storage = $storageRepository->find(2);

        foreach ($newIngredients as $ingredient) {
            $newIngredients[$i]
                ->setStorage($storage)
                ->setChecked(false)
                ->setPosition($highestPosition + $i)
            ;

            $i++;
        }

        // Add new shopping list ingredients to the database
        foreach($newIngredients as $ingredient) {
            $ingredientRepository->add($ingredient, true);
        }

        // Empty Response
        return new Response();
    }
}
