<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use JMS\Serializer\SerializerBuilder;

#[Route('/api/user')]
class UserController extends AbstractController
{
    /**
     * User API
     *
     * @return Response
     */
    #[Route('/', name: 'api_user')]
    public function index(): Response
    {
        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize([
            'id' => $this->getUser()?->getId(),
            'username' => $this->getUser()?->getUsername(),
            'roles' => $this->getUser()?->getRoles(),
        ], 'json');

        return new JsonResponse($jsonContent);
    }

    /**
     * User List API
     */
    #[Route('/list', name: 'api_user_list')]
    public function users(UserRepository $userRepository): Response
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Fetch all User objects from the database
        $users = $userRepository->findAll();

        // Create array for response
        $usersResponse = [];

        // Add public data to the response array
        foreach ($users as $user) {
            $usersResponse[] = [
                'username' => $user->getUsername(),
                'id' => $user->getId(),
                'value' => $user->getId(),
            ];
        }

        // Serialize data and respond
        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($usersResponse, 'json');

        return new JsonResponse($jsonContent);
    }
}
