<?php namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\DtoResponseService;
use App\Service\UserControllerService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * User API
 */
#[Route('/api')]
class UserController extends AbstractControllerWithMapper
{
    public function __construct(
        private readonly UserControllerService $userControllerService,
        private readonly UserPasswordHasherInterface $userPasswordHasher,
        private readonly UserRepository $userRepository,
    ) {
        parent::__construct(User::class);
    }

    #[Route('/user', name: 'api_user_getCurrentlySignedInUser', methods: ['GET'])]
    public function getCurrentlySignedInUser(): Response
    {
        $userDTO = $this->mapper->entityToDto($this->userControllerService->getUser());
        return DtoResponseService::getResponse($userDTO);
    }

    #[Route('/users', name: 'api_user_getAll', methods: ['GET'])]
    public function getAll(): Response
    {
        $userDTOs = (new ArrayCollection($this->userRepository->findAll()))
            ->map(fn ($user) => $this->mapper->entityToDto($user));
        return DtoResponseService::getResponse($userDTOs);
    }

    #[Route('/users/{id}', name: 'api_users_patch', methods: ['PATCH'])]
    public function patch(Request $request, User $user): Response
    {
        if ($this->userControllerService->getUser()->getId() != $user->getId()) {
            return new Response("Cannot change email of another user.", 403);
        }

        $data = json_decode($request->getContent(), false);

        if (property_exists($data, "email") && is_string($data->email) && strlen($data->email) > 0) {
            if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
                return new Response("Email address is not valid.", 400);
            }

            $user->setEmail($data->email);
        }

        if (property_exists($data, "password") && is_string($data->password) && strlen($data->password) > 0) {
            if (strlen($data->password) < 6) {
                return new Response("Passwords need to be at least 6 characters long.", 400);
            }

            $user->setPassword($this->userPasswordHasher->hashPassword($user, $data->password));
        }

        $this->userRepository->add($user, true);
        return DtoResponseService::getResponse($this->mapper->entityToDto($user));
    }
}
