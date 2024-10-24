<?php namespace App\Controller;

use App\Component\Response\PrettyJsonResponse;
use App\Entity\Roles;
use App\Service\UserControllerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController extends AbstractController {
    public function __construct(
        private readonly UserControllerService $userControllerService,
    ) {}

    #[Route('/api/login', name: 'api_login')]
    public function index(AuthenticationUtils $authenticationUtils): Response {
        $error = $authenticationUtils->getLastAuthenticationError();

        if ($error == null && !$this->userControllerService->getUser()->isActive()) {
            return new PrettyJsonResponse([
                'error' => "Account is not active. Please contact your administrator.",
            ], 401);
        }

        if ($error == null && !in_array(Roles::ROLE_ADMIN->value, $this->userControllerService->getUser()->getRoles())) {
            return new PrettyJsonResponse([
                'error' => "Für den Zugriff auf alle Funktionen sind Admin-Berechtigungen nötig.",
            ], 401);
        }

        return new PrettyJsonResponse([
            'error' => $error,
        ]);
    }
}
