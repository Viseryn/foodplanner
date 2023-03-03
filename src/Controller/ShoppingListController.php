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
 * 
 * @todo The request data should always be an IngredientModel JSON object. (?)
 */
#[Route('/api/shoppinglist')]
class ShoppingListController extends AbstractController
{
    /**
     * ShoppingList Ingredients API
     * 
     * Responds with an array of JSON objects matching the type specifications of IngredientModel.ts.
     *
     * @param IngredientRepository $ingredientRepository
     * @return Response
     */
    #[Route('/ingredients', name: 'api_shoppinglist_ingredients', methods: ['GET'])]
    public function ingredients(
        IngredientRepository $ingredientRepository,
        IngredientUtil $ingredientUtil,
    ): Response {
        $ingredients = $ingredientRepository->findBy(['storage' => '2'], ['position' => 'ASC']);

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($ingredientUtil->getApiModels($ingredients), 'json');

        return (new JsonResponse($jsonContent));
    }


    /**
     * ShoppingList Add API
     * 
     * A ShoppingList API that, given a request with an array of strings, creates new Ingredient 
     * objects from these strings and adds them to the database.
     *
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @param ShoppingListUtil $shoppingListUtil
     * @return Response
     * 
     * @example ['200 g Spaghetti', 'Hartkäse', '2 1/2 Karotten']
     */
    #[Route('/add', name: 'api_shoppinglist_add', methods: ['GET', 'POST'])]
    public function add(
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request, 
        ShoppingListUtil $shoppingListUtil,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = json_decode($request->getContent());

        $shoppingListUtil->add($requestContent);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * ShoppingList Delete All API
     * 
     * A ShoppingList API that deletes all Ingredient objects that the ShoppingList has.
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
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $shoppingListUtil->deleteAll();

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }
    
    /**
     * ShoppingList Delete Checked API
     * 
     * A ShoppingList API that deletes all Ingredient objects that the ShoppingList has which have 
     * been marked as checked, i.e. ingredient.checked = true for some ingredient.
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
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $ingredients = $ingredientRepository->findBy(['checked' => true]);

        foreach ($ingredients as $ingredient) {
            $ingredientRepository->remove($ingredient, true);
        }

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * ShoppingList Check Ingredient API
     * 
     * A ShoppingList API that checks or unchecks a given Ingredient object from the ShoppingList. 
     * The request data should be the ID of the Ingredient object.
     *
     * @param IngredientRepository $ingredientRepository
     * @param Request $request
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/check-ingredient', name: 'api_shoppinglist_check_ingredient', methods: ['GET', 'POST'])]
    public function checkIngredient(
        IngredientRepository $ingredientRepository,
        Request $request,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = json_decode($request->getContent());
        
        $ingredient = $ingredientRepository->find($requestContent);
        $ingredient->setChecked(!$ingredient->isChecked());

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * ShoppingList Edit Ingredient API
     * 
     * A ShoppingList API that edits a given Ingredient object from the ShoppingList. The request 
     * data should be a IngredientModel JSON object, except for quantityUnit and quantityValue 
     * being empty and the whole description being contained in name.
     *
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @param ShoppingListUtil $shoppingListUtil
     * @return Response
     * 
     * @todo The request data should be a genuine IngredientModel JSON object.
     */
    #[Route('/edit-ingredient', name: 'api_shoppinglist_edit_ingredient', methods: ['GET', 'POST'])]
    public function editIngredient(
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request,
        ShoppingListUtil $shoppingListUtil,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = (array) json_decode($request->getContent());
        
        $shoppingListUtil->editIngredient($requestContent);
        
        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * ShoppingList Replace API
     * 
     * A ShoppingList API that replaces the current Ingredient objects of the ShoppingList with new 
     * ones. It basically does the same as running deleteAll() and then add().
     *
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @param ShoppingListUtil $shoppingListUtil
     * @return Response
     * 
     * @example ['200 g Spaghetti', 'Hartkäse', '2 1/2 Karotten']
     */
    #[Route('/replace', name: 'api_shoppinglist_replace', methods: ['GET', 'POST'])]
    public function replace(
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request,
        ShoppingListUtil $shoppingListUtil,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = json_decode($request->getContent());
        
        $shoppingListUtil->replace($requestContent);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * ShoppingList Change Position API
     * 
     * A ShoppingList API that swaps the position of two Ingredient objects.
     *
     * @param IngredientRepository $ingredientRepository
     * @param IngredientUtil $ingredientUtil
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @return Response
     */
    #[Route('/change-position', name: 'api_shoppinglist_change_position', methods: ['GET', 'POST'])]
    public function changePosition(
        IngredientRepository $ingredientRepository,
        IngredientUtil $ingredientUtil,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = (array) json_decode($request->getContent());

        $ingredient1 = $ingredientRepository->find($requestContent[0]);
        $ingredient2 = $ingredientRepository->find($requestContent[1]);

        $ingredientUtil->swapIngredients($ingredient1, $ingredient2);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }
}
