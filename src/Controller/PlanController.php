<?php

namespace App\Controller;

use App\Entity\Day;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/plan')]
class PlanController extends AbstractController
{
    #[Route('/', name: 'app_plan_index')]
    public function index(): Response
    {
        # Fetch all days from current week
        # Then:

        return $this->render('plan/index.html.twig', [
            'days' => $days,
        ]);
    }


    // #[Route('/new', name: 'app_day_new', methods: ['GET', 'POST'])]
    public function newDay(Request $request): Response
    {
        
    }
}
