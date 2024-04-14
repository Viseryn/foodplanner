<?php

namespace App\Controller;

use App\Repository\InstallationStatusRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * DefaultController
 * 
 * All requests are handled by this controller and render the base template. All further rendering 
 * is done by React in /assets/app.js.
 */
class DefaultController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'app_default', requirements: ['reactRouting' => '(?!api).+'], defaults: ['reactRouting' => null])]
    public function default(InstallationStatusRepository $repository): Response
    {
        return $this->render('default/index.html.twig');
    }
}
