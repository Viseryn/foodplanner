<?php

namespace App\Controller;

use App\Entity\Day;
use App\Form\DayType;
use App\Repository\DayRepository;
use App\Service\PlanUtil;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class DayController extends AbstractController
{
    #[Route('/api/days', name: 'app_day_list', methods: ['GET'])]
    /**
     * Day List API
     * 
     * Fetches all Day objects and responds with a JSON
     * array containing all the data, including all Meals
     * that are related to that Day.
     *
     * @param DayRepository $dayRepository
     * @return Response
     */
    public function list(DayRepository $dayRepository): Response
    {
        $daysResult = $dayRepository->findAll();
        $days = [];
        $i = 0;

        foreach ($daysResult as $day) {
            // Simplify meals array
            $meals = [];
            $j = 0;

            foreach ($day->getMeals() as $meal) {
                $meals[$j] = [
                    'id' => $meal->getId(),
                    'meal_category' => $meal->getMealCategory(),
                    'recipe' => [
                        'id' => $meal->getRecipe()->getId(),
                        'title' => $meal->getRecipe()->getTitle(),
                        'image' => [
                            'filename' => $meal->getRecipe()->getImage()?->getFilename(),
                            'directory' => $meal->getRecipe()->getImage()?->getDirectory(),
                        ],
                    ],
                    'user_group' => (string) $meal->getUserGroup(),
                ];

                $j++;
            }

            // Setup days array entry
            $days[$i] = [
                'id' => $day->getId(),
                'weekday' => $day->getWeekday(),
                'date' => $day->getDate(),
                'meals' => $meals,
            ];

            $i++;
        }

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($days, 'json');

        return (new JsonResponse($jsonContent));
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
