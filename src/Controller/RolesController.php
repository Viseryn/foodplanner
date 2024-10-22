<?php namespace App\Controller;

use App\Component\Response\PrettyJsonResponse;
use App\Entity\Roles;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/roles')]
class RolesController extends AbstractController {
    #[Route('', name: 'api_roles_getAll', methods: ['GET'])]
    public function getAll(): Response {
        return new PrettyJsonResponse(Roles::cases());
    }
}
