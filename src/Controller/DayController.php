<?php

namespace App\Controller;

use App\Entity\Day;
use App\Form\DayType;
use App\Repository\DayRepository;
use App\Service\PlanUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/day')]
class DayController extends AbstractController
{
    #[Route('/', name: 'app_day_index', methods: ['GET'])]
    public function index(DayRepository $dayRepository): Response
    {
        return $this->render('day/index.html.twig', [
            'days' => $dayRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'app_day_new', methods: ['GET'])]
    public function new(PlanUtil $planUtil, DayRepository $dayRepository): Response
    {
        $currentWeek = $planUtil->currentWeek();

        foreach ($currentWeek as $day) {
            $dayRepository->add($day, true);
        }
        
        return $this->redirectToRoute('app_plan_index', [], Response::HTTP_SEE_OTHER);
    }

    #[Route('/new/next', name: 'app_day_new_next', methods: ['GET'])]
    public function newNext(PlanUtil $planUtil, DayRepository $dayRepository): Response
    {
        $nextWeek = $planUtil->nextWeek();

        foreach ($nextWeek as $day) {
            $dayRepository->add($day, true);
        }

        return $this->redirectToRoute('app_plan_index', [], Response::HTTP_SEE_OTHER);
    }

    #[Route('/delete/all', name: 'app_day_delete_all', methods: ['GET'])]
    public function deleteAll(DayRepository $dayRepository): Response
    {
        $days = $dayRepository->findAll();
        
        foreach ($days as $day) {
            $dayRepository->remove($day, true);
        }

        return $this->redirectToRoute('app_plan_index', [], Response::HTTP_SEE_OTHER);
    }

    #[Route('/{id}', name: 'app_day_delete', methods: ['POST'])]
    public function delete(Request $request, Day $day, DayRepository $dayRepository): Response
    {
        if ($this->isCsrfTokenValid('delete'.$day->getId(), $request->request->get('_token'))) {
            $dayRepository->remove($day, true);
        }

        return $this->redirectToRoute('app_day_index', [], Response::HTTP_SEE_OTHER);
    }
}
