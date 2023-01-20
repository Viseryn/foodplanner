<?php

namespace App\Controller;

use App\Entity\Ingredient;
use App\Entity\RefreshDataTimestamp;
use App\Repository\IngredientRepository;
use App\Repository\RecipeRepository;
use App\Repository\StorageRepository;
use App\Service\IngredientUtil;
use App\Service\PantryUtil;
use App\Service\RefreshDataTimestampUtil;
use Doctrine\Common\Collections\ArrayCollection;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Pantry API
 */
#[Route('/api/pantry')]
class PantryController extends AbstractController
{
    /**
     * Pantry Ingredients API
     * 
     * A Pantry API that responds with the list of 
     * all Ingredient objects that the Pantry has.
     * 
     * Expected ResponseData Type: 
     *     Array<object>
     * 
     * Example ResponseData:
     * [
     *     {
     *         id: 21491,
     *         name: 'Spaghetti',
     *         quantity_value: '200',
     *         quantity_unit: 'g',
     *     },
     *     ...
     * ]
     *
     * @param IngredientRepository $ingredientRepository
     * @return Response
     */
    #[Route('/ingredients', name: 'api_pantry_ingredients', methods: ['GET'])]
    public function ingredients(
        IngredientRepository $ingredientRepository
    ): Response {
        $ingredients = $ingredientRepository->findBy(['storage' => '1'], ['position' => 'ASC']);

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($ingredients, 'json');

        return (new JsonResponse($jsonContent));
    }

    /**
     * Pantry Add API
     * 
     * A Pantry API that, given a request with 
     * an array of strings, creates new Ingredient 
     * objects from these strings and adds them to the 
     * database.
     * 
     * Expected RequestContent Type: 
     *     string[]
     * 
     * Example RequestContent:
     *     ['200 g Spaghetti', 'Hartkäse', '2 1/2 Karotten']
     *
     * @param Request $request
     * @param PantryUtil $pantryUtil
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/add', name: 'api_pantry_add', methods: ['GET', 'POST'])]
    public function add(
        Request $request, 
        PantryUtil $pantryUtil,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Decode request content
        $requestContent = json_decode($request->getContent());
        
        // Add ingredients from request
        $pantryUtil->add($requestContent);

        // Update RefreshDataTimestamp
        $refreshDataTimestampUtil->updateTimestamp();

        // Empty response
        return new Response();
    }

    /**
     * Pantry Delete All API
     * 
     * A Pantry API that deletes all Ingredient objects 
     * that the Pantry has.
     * 
     * @param PantryUtil $pantryUtil
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/delete-all', name: 'api_pantry_delete_all', methods: ['GET'])]
    public function deleteAll(
        PantryUtil $pantryUtil,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Delete all pantry ingredients from database
        $pantryUtil->deleteAll();

        // Update RefreshDataTimestamp
        $refreshDataTimestampUtil->updateTimestamp();

        // Empty response
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
