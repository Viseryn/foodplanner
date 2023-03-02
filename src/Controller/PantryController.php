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
 * 
 * @todo The request data should always be an IngredientModel JSON object. (?)
 */
#[Route('/api/pantry')]
class PantryController extends AbstractController
{
    /**
     * Pantry Ingredients API
     * 
     * Responds with an array of JSON objects matching the type specifications of IngredientModel.ts.
     *
     * @param IngredientRepository $ingredientRepository
     * @return Response
     */
    #[Route('/ingredients', name: 'api_pantry_ingredients', methods: ['GET'])]
    public function ingredients(
        IngredientRepository $ingredientRepository,
        IngredientUtil $ingredientUtil,
    ): Response {
        $ingredients = $ingredientRepository->findBy(['storage' => '1'], ['position' => 'ASC']);

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($ingredientUtil->getApiModels($ingredients), 'json');

        return (new JsonResponse($jsonContent));
    }

    /**
     * Pantry Add API
     * 
     * A Pantry API that, given a request with an array of strings, creates new Ingredient objects 
     * from these strings and adds them to the database.
     *
     * @param PantryUtil $pantryUtil
     * @param Request $request
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     * 
     * @example ['200 g Spaghetti', 'Hartkäse', '2 1/2 Karotten']
     */
    #[Route('/add', name: 'api_pantry_add', methods: ['GET', 'POST'])]
    public function add(
        PantryUtil $pantryUtil,
        Request $request, 
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = json_decode($request->getContent());
        
        $pantryUtil->add($requestContent);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * Pantry Delete All API
     * 
     * A Pantry API that deletes all Ingredient objects the Pantry has.
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
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $pantryUtil->deleteAll();

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * Pantry Delete Ingredient API
     * 
     * A Pantry API that checks or unchecks a given Ingredient object from the Pantry. The request 
     * data should be the ID of the Ingredient object.
     *
     * @param IngredientRepository $ingredientRepository
     * @param Request $request
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/delete-ingredient', name: 'api_pantry_delete_ingredient', methods: ['GET', 'POST'])]
    public function deleteIngredient(
        IngredientRepository $ingredientRepository,
        Request $request,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = json_decode($request->getContent());
        
        $ingredient = $ingredientRepository->find($requestContent);
        $ingredientRepository->remove($ingredient, true);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * Pantry Edit Ingredient API
     * 
     * A Pantry API that edit a given Ingredient object from the Pantry. The request 
     * data should be a IngredientModel JSON object, except for quantityUnit and quantityValue 
     * being empty and the whole description being contained in name.
     *
     * @param PantryUtil $pantryUtil
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @return Response
     */
    #[Route('/edit-ingredient', name: 'api_pantry_edit_ingredient', methods: ['GET', 'POST'])]
    public function editIngredient(
        PantryUtil $pantryUtil,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = (array) json_decode($request->getContent());
        
        $pantryUtil->editIngredient($requestContent);
        
        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * Pantry Replace API
     * 
     * A Pantry API that replaces the current Ingredient objects of the Pantry with new ones. 
     * It basically does the same as running deleteAll() and then add().
     *
     * @param PantryUtil $pantryUtil
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @return Response
     * 
     * @example ['200 g Spaghetti', 'Hartkäse', '2 1/2 Karotten']
     */
    #[Route('/replace', name: 'api_pantry_replace', methods: ['GET', 'POST'])]
    public function replace(
        PantryUtil $pantryUtil,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = json_decode($request->getContent());
        
        $pantryUtil->replace($requestContent);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * Pantry Change Position API
     * 
     * A Pantry API that swaps the position of two Ingredient objects.
     *
     * @param IngredientRepository $ingredientRepository
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @return Response
     */
    #[Route('/change-position', name: 'api_pantry_change_position', methods: ['GET', 'POST'])]
    public function changePosition(
        IngredientRepository $ingredientRepository,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = (array) json_decode($request->getContent());

        $ingredient1 = $ingredientRepository->find($requestContent[0]);
        $ingredient2 = $ingredientRepository->find($requestContent[1]);

        $position1 = $ingredient1->getPosition();
        $position2 = $ingredient2->getPosition();

        $ingredient1->setPosition($position2);
        $ingredient2->setPosition($position1);

        $ingredientRepository->save($ingredient1, true);
        $ingredientRepository->save($ingredient2, true);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }
}
