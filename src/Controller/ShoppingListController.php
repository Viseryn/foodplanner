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
     * ShoppingList Ingredients API
     * 
     * A ShoppingList API that responds with the list of 
     * all Ingredient objects that the ShoppingList has.
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
     *     {
     *         id: 21492,
     *         name: 'Hartkäse',
     *         checked: true,
     *     },
     * ]
     *
     * @param IngredientRepository $ingredientRepository
     * @return Response
     */
    #[Route('/ingredients', name: 'api_shoppinglist_ingredients', methods: ['GET'])]
    public function ingredients(
        IngredientRepository $ingredientRepository
    ): Response {
        $ingredients = $ingredientRepository->findBy(['storage' => '2'], ['position' => 'ASC']);

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($ingredients, 'json');

        return (new JsonResponse($jsonContent));
    }


    /**
     * ShoppingList Add API
     * 
     * A ShoppingList API that, given a request with 
     * an array of strings, creates new Ingredient 
     * objects from these strings and adds them to the 
     * database.
     * 
     * The Ingredient objects are created by using the 
     * IngredientUtil::transformStringArrayToObjectArray()
     * method and then prepared for the ShoppingList storage
     * by the IngredientUtil::prepareIngredients() method.
     * 
     * Expected RequestContent Type: 
     *     string[]
     * 
     * Example RequestContent:
     *     ['200 g Spaghetti', 'Hartkäse', '2 1/2 Karotten']
     *
     * @param Request $request
     * @param IngredientRepository $ingredientRepository
     * @param IngredientUtil $ingredientUtil
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/add', name: 'api_shoppinglist_add', methods: ['GET', 'POST'])]
    public function add(
        Request $request, 
        IngredientRepository $ingredientRepository, 
        IngredientUtil $ingredientUtil,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Decode request data
        $requestContent = json_decode($request->getContent());
        
        // Turn requestContent into array of Ingredient objects
        $ingredients = $ingredientUtil->transformStringArrayToObjectArray($requestContent);

        // Prepare Ingredient objects for ShoppingList storage
        $ingredientUtil->prepareIngredients('shoppinglist', $ingredients);

        // Add Ingredient objects to database
        foreach ($ingredients as $ingredient) {
            $ingredientRepository->save($ingredient, true);
        }

        // Update Refresh Data Timestamp
        $refreshDataTimestampUtil->updateTimestamp();

        // Empty response
        return new Response();
    }

    /**
     * ShoppingList Delete All API
     * 
     * A ShoppingList API that deletes all Ingredient objects 
     * that the ShoppingList has.
     * 
     * @param IngredientRepository $ingredientRepository
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     */
    #[Route('/delete-all', name: 'api_shoppinglist_delete_all', methods: ['GET'])]
    public function deleteAll(
        IngredientRepository $ingredientRepository,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Delete all shopping list ingredients from database
        $ingredients = $ingredientRepository->findBy(['storage' => '2'], ['position' => 'ASC']);
        
        foreach($ingredients as $ingredient) {
            $ingredientRepository->remove($ingredient, true);
        }

        // Update Refresh Data Timestamp
        $refreshDataTimestampUtil->updateTimestamp();

        // Empty response
        return new Response();
    }




}
