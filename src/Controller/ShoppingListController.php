<?php

namespace App\Controller;

use App\Repository\IngredientRepository;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
}
