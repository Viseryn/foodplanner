<?php namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\DtoResponseService;
use App\Service\UserControllerService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * User API
 */
#[Route('/api')]
class UserController extends AbstractControllerWithMapper
{
    public function __construct(
        private readonly UserControllerService $userControllerService,
        private readonly UserRepository $userRepository,
    ) {
        parent::__construct(User::class);
    }

    /**
     * Responds with the User object of the currently signed in user.
     */
    #[Route('/user', name: 'api_user_getCurrentlySignedInUser', methods: ['GET'])]
    public function getCurrentlySignedInUser(): Response
    {
        $userDTO = $this->mapper->entityToDto($this->userControllerService->getUser());
        return DtoResponseService::getResponse($userDTO);
    }

    /**
     * Responds with a list of all User objects.
     */
    #[Route('/users', name: 'api_user_getAll', methods: ['GET'])]
    public function getAll(): Response
    {
        $userDTOs = (new ArrayCollection($this->userRepository->findAll()))
            ->map(fn ($user) => $this->mapper->entityToDto($user));
        return DtoResponseService::getResponse($userDTOs);
    }
}
