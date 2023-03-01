<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Service\UserUtil;
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
    public function index(UserUtil $userUtil): Response
    {
        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($userUtil->getApiModel($this->getUser()), 'json');

        return new JsonResponse($jsonContent);
    }

    /**
     * User List API
     */
    #[Route('/list', name: 'api_user_list')]
    public function users(UserRepository $userRepository, UserUtil $userUtil): Response
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Fetch all User objects from the database
        $users = $userRepository->findAll();

        // Serialize data and respond
        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($userUtil->getApiModels($users), 'json');

        return new JsonResponse($jsonContent);
    }
}
