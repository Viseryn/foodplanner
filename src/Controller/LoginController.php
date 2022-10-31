<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use JMS\Serializer\SerializerBuilder;

class LoginController extends AbstractController
{
    #[Route('/api/login', name: 'app_login')]
    public function index(AuthenticationUtils $authenticationUtils): Response
    {
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize([
            'error' => $error->getMessageKey(),
        ], 'json');

        return new JsonResponse($jsonContent);
    }
}
