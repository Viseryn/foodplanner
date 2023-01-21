<?php

namespace App\Controller;

use App\Repository\IngredientRepository;
use App\Service\IngredientUtil;
use App\Service\RefreshDataTimestampUtil;
use App\Service\ShoppingListUtil;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * ShoppingList API
 */
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
     * Expected RequestContent Type: 
     *     string[]
     * 
     * Example RequestContent:
     *     ['200 g Spaghetti', 'Hartkäse', '2 1/2 Karotten']
     *
     * @param Request $request
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param ShoppingListUtil $shoppingListUtil
     * @return Response
     */
    #[Route('/add', name: 'api_shoppinglist_add', methods: ['GET', 'POST'])]
    public function add(
        Request $request, 
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        ShoppingListUtil $shoppingListUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Decode request content
        $requestContent = json_decode($request->getContent());
        
        // Add ingredients from request
        $shoppingListUtil->add($requestContent);

        // Update RefreshDataTimestamp
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
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param ShoppingListUtil $shoppingListUtil
     * @return Response
     */
    #[Route('/delete-all', name: 'api_shoppinglist_delete_all', methods: ['GET'])]
    public function deleteAll(
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        ShoppingListUtil $shoppingListUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Delete all shopping list ingredients from database
        $shoppingListUtil->deleteAll();

        // Update RefreshDataTimestamp
        $refreshDataTimestampUtil->updateTimestamp();

        // Empty response
        return new Response();
    }
    
    /**
     * ShoppingList Delete Checked API
     * 
     * A ShoppingList API that deletes all Ingredient objects
     * that the ShoppingList has which have been marked as 
     * checked, i.e. ingredient.checked = true for some ingredient.
     *
     * @param IngredientRepository $ingredientRepository
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/delete-checked', name: 'api_shoppinglist_delete_checked', methods: ['GET'])]
    public function deleteChecked(
        IngredientRepository $ingredientRepository,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Find all checked Ingredient objects
        $ingredients = $ingredientRepository->findBy(['checked' => true]);

        // Remove checked ingredients from database
        foreach ($ingredients as $ingredient) {
            $ingredientRepository->remove($ingredient, true);
        }

        // Update RefreshDataTimestamp
        $refreshDataTimestampUtil->updateTimestamp();

        // Empty response
        return new Response();
    }

    /**
     * ShoppingList Check Ingredient API
     * 
     * A ShoppingList API that checks or unchecks a given 
     * Ingredient object from the ShoppingList. The request 
     * data should be the ID of the Ingredient object.
     * 
     * Expected RequestContent Type: 
     *     int
     * 
     * Example RequestContent:
     *     24
     *
     * @param Request $request
     * @param IngredientRepository $ingredientRepository
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/check-ingredient', name: 'api_shoppinglist_check_ingredient', methods: ['GET', 'POST'])]
    public function checkIngredient(
        Request $request,
        IngredientRepository $ingredientRepository,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Decode request data
        $requestContent = json_decode($request->getContent());
        
        // Find Ingredient object and negate checked property
        $ingredient = $ingredientRepository->find($requestContent);
        $ingredient->setChecked(!$ingredient->isChecked());

        // Update RefreshDataTimestamp
        $refreshDataTimestampUtil->updateTimestamp();

        // Empty response
        return new Response();
    }

    /**
     * ShoppingList Edit Ingredient API
     * 
     * A ShoppingList API that edit a given 
     * Ingredient object from the ShoppingList. The request 
     * data should consist of the edited Ingredient object.
     * Note that quantity_unit and quantity_value will be 
     * empty and the whole description is contained in name.
     * 
     * Expected RequestContent Type: 
     *     array<string, mixed>
     * 
     * Example RequestContent:
     *     ['id' => int, 'name' => string, ...]
     *
     * @param Request $request
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param ShoppingListUtil $shoppingListUtil
     * @return Response
     */
    #[Route('/edit-ingredient', name: 'api_shoppinglist_edit_ingredient', methods: ['GET', 'POST'])]
    public function editIngredient(
        Request $request,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        ShoppingListUtil $shoppingListUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Decode request data
        $requestContent = (array) json_decode($request->getContent());
        
        // Update the Ingredient object
        $shoppingListUtil->editIngredient($requestContent);
        
        // Update RefreshDataTimestamp
        $refreshDataTimestampUtil->updateTimestamp();

        // Empty response
        return new Response();
    }

    /**
     * ShoppingList Replace API
     * 
     * A ShoppingList API that replaces the current 
     * Ingredient objects of the ShoppingList with 
     * new ones. It basically does the same as running
     * deleteAll() and then add().
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
     * @param ShoppingListUtil $shoppingListUtil
     * @return Response
     */
    #[Route('/replace', name: 'api_shoppinglist_replace', methods: ['GET', 'POST'])]
    public function replace(
        Request $request,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        ShoppingListUtil $shoppingListUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Decode request data
        $requestContent = json_decode($request->getContent());
        
        // Replace ShoppingList in the database
        $shoppingListUtil->replace($requestContent);

        // Update RefreshDataTimestamp
        $refreshDataTimestampUtil->updateTimestamp();

        // Empty response
        return new Response();
    }

    /**
     * ShoppingList Change Position API
     * 
     * A ShoppingList API that swaps the position of 
     * two Ingredient objects.
     *
     * @param Request $request
     * @param IngredientRepository $ingredientRepository
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/change-position', name: 'api_shoppinglist_change_position', methods: ['GET', 'POST'])]
    public function changePosition(
        Request $request,
        IngredientRepository $ingredientRepository,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Decode request data
        $requestContent = (array) json_decode($request->getContent());

        // Get both Ingredient objects
        $ingredient1 = $ingredientRepository->find($requestContent[0]);
        $ingredient2 = $ingredientRepository->find($requestContent[1]);

        // Get positions
        $position1 = $ingredient1->getPosition();
        $position2 = $ingredient2->getPosition();

        // Swap positions
        $ingredient1->setPosition($position2);
        $ingredient2->setPosition($position1);

        // Save in database
        $ingredientRepository->save($ingredient1, true);
        $ingredientRepository->save($ingredient2, true);

        // Update RefreshDataTimestamp
        $refreshDataTimestampUtil->updateTimestamp();

        // Empty response
        return new Response();
    }
}
