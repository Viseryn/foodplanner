<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use JMS\Serializer\SerializerBuilder;

class UserController extends AbstractController
{
    #[Route('/api/user', name: 'app_user')]
    public function index(): Response
    {
        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize([
            'user' => [
                'username' => $this->getUser()?->getUsername(),
                'roles' => $this->getUser()?->getRoles(),
            ],
        ], 'json');

        return new JsonResponse($jsonContent);
    }
}
