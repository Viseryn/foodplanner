<?php

namespace App\Controller;

use App\Component\Response\PrettyJsonResponse;
use App\Entity\Role;
use App\Provider\CurrentlyAuthenticatedUserProvider;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController {
    public function __construct(
        private readonly CurrentlyAuthenticatedUserProvider $currentlyAuthenticatedUserProvider,
    ) {}

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function index(AuthenticationUtils $authenticationUtils): Response {
        $error = $authenticationUtils->getLastAuthenticationError();

        if ($error == null && !$this->currentlyAuthenticatedUserProvider->provide()->isActive()) {
            return new PrettyJsonResponse([
                'error' => "Your account has not been activated by an administrator yet.",
            ], 401);
        }

        if ($error == null && !in_array(Role::ADMIN, $this->currentlyAuthenticatedUserProvider->provide()->getEnumRoles())) {
            return new PrettyJsonResponse([
                'error' => "Your account does not have the necessary roles.",
            ], 401);
        }

        return new PrettyJsonResponse([
            'error' => $error,
        ]);
    }
}
