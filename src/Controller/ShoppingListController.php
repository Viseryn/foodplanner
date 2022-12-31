<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Repository\IngredientRepository;
use App\Repository\RecipeRepository;
use App\Repository\StorageRepository;
use App\Service\IngredientUtil;
use Doctrine\Common\Collections\ArrayCollection;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/shoppinglist')]
class ShoppingListController extends AbstractController
{
    /**
     * ShoppingList API
     *
     * @param IngredientRepository $ingredientRepository
     * @return Response
     */
    #[Route('/', name: 'api_shoppinglist', methods: ['GET'])]
    public function index(IngredientRepository $ingredientRepository): Response
    {
        $ingredients = $ingredientRepository->findBy(['storage' => '2'], ['position' => 'ASC']);

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($ingredients, 'json');

        return (new JsonResponse($jsonContent));
    }

    /**
     * ShoppingList Update API
     *
     * @param Request $request
     * @param StorageRepository $storageRepository
     * @param IngredientRepository $ingredientRepository
     * @param IngredientUtil $ingredientUtil
     * @return Response
     */
    #[Route('/update', name: 'api_shoppinglist_update', methods: ['GET', 'POST'])]
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

    /**
     * ShoppingList Add API
     *
     * @param Request $request
     * @param RecipeRepository $recipeRepository
     * @param StorageRepository $storageRepository
     * @param IngredientRepository $ingredientRepository
     * @param IngredientUtil $ingredientUtil
     * @return Response
     */
    #[Route('/add', name: 'api_shoppinglist_add', methods: ['GET', 'POST'])]
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

        // If only one recipe is given, the quantity might have been changed
        if (count($requestContent) === 1) {
            // Array for new ingredient objects, since
            // these are not in the database
            $ingredientsArr = [];

            // Create a new Ingredient object for each ingredient from the request
            foreach ($requestContent[0]->ingredients as $rawIngredient) {
                $ingredientsArr[] = (new Ingredient())
                    ->setName($rawIngredient->name)
                    ->setQuantityValue($rawIngredient->quantity_value)
                    ->setQuantityUnit($rawIngredient->quantity_unit)
                ;
            }

            // Create the ingredient string
            $ingredients .= $ingredientUtil->ingredientString(new ArrayCollection($ingredientsArr));
        }

        // For multiple recipes, go through all their ingredients
        if (count($requestContent) > 1) {
            foreach ($requestContent as $recipeData) {
                $recipe = $recipeRepository->find($recipeData->id);
                $ingredients .= $ingredientUtil->ingredientString($recipe->getIngredients());
                $ingredients .= "\n";
            }
        }

        // Transform data into Ingredient objects
        $newIngredients = $ingredientUtil->ingredientSplit($ingredients);

        // Check highest position
        $oldIngredients = $ingredientRepository->findBy(['storage' => '2'], ['position' => 'DESC']);
        $highestPosition = (count($oldIngredients) > 0) ? $oldIngredients[0]->getPosition() : 0;

        // Add position and checked to Ingredient objects
        $i = 0;
        $storage = $storageRepository->find(2);

        foreach ($newIngredients as $ingredient) {
            $newIngredients[$i]
                ->setStorage($storage)
                ->setChecked(false)
                ->setPosition($highestPosition + 1 + $i)
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

    /**
     * ShoppingList Ingredients API
     *
     * @param Request $request
     * @param StorageRepository $storageRepository
     * @param IngredientRepository $ingredientRepository
     * @param IngredientUtil $ingredientUtil
     * @return Response
     */
    #[Route('/ingredients', name: 'api_shoppinglist_ingredients', methods: ['GET', 'POST'])]
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
        $oldIngredients = $ingredientRepository->findBy(['storage' => '2'], ['position' => 'DESC']);
        $highestPosition = (count($oldIngredients) > 0) ? $oldIngredients[0]->getPosition() : 0;

        // Add position and checked to Ingredient object
        $storage = $storageRepository->find(2);
        $newIngredient
            ->setStorage($storage)
            ->setChecked(false)
            ->setPosition($highestPosition + 1)
        ;

        // Add new shopping list ingredient to the database
        $ingredientRepository->add($newIngredient, true);

        // Empty Response
        return new Response($newIngredient);
    }
}
