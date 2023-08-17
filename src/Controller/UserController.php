<?php

namespace App\Controller;

use App\DataTransferObject\DTOSerializer;
use App\DataTransferObject\UserDTO;
use App\Repository\UserRepository;
use App\Service\UserControllerService;
use App\Service\UserUtil;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * User API
 */
#[Route('/api')]
class UserController extends AbstractController
{
    public function __construct(
        private UserControllerService $userControllerService,
        private UserRepository $userRepository,
    ) {}

    /**
     * Responds with the User object of the currently signed in user.
     */
    #[Route('/user', name: 'api_user_getCurrentlySignedInUser', methods: ['GET'])]
    public function getCurrentlySignedInUser(): Response
    {
        $userDTO = new UserDTO($this->userControllerService->getUser());
        return DTOSerializer::getResponse($userDTO);
    }

    /**
     * Responds with a list of all User objects.
     */
    #[Route('/users', name: 'api_user_getAll', methods: ['GET'])]
    public function getAll(UserRepository $userRepository, UserUtil $userUtil): Response
    {
        $userDTOs = (new ArrayCollection($this->userRepository->findAll()))
            ->map(fn ($user) => new UserDTO($user));
        return DTOSerializer::getResponse($userDTOs);
    }
}
