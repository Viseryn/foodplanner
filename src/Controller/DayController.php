<?php

namespace App\Controller;

use App\Entity\Day;
use App\Repository\DayRepository;
use App\Service\PlanUtil;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class DayController extends AbstractController
{
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
    #[Route('/api/days', name: 'app_day_list', methods: ['GET'])]
    public function list(DayRepository $dayRepository): Response
    {
        $daysResult = $dayRepository->findBy([], ['timestamp' => 'ASC']);
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
                'title' => $day->getDate() . ', ' . $day->getWeekday(),
                'date' => $day->getDate(),
                'meals' => $meals,
            ];

            $i++;
        }

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($days, 'json');

        return (new JsonResponse($jsonContent));
    }

    /**
     * Update Days API
     * 
     * Deletes all past Day objects and creates new Day objects up 
     * to ten days in the future.
     *
     * @param DayRepository $dayRepository
     * @return Response
     */
    #[Route('/api/day/update', name: 'app_day_new', methods: ['GET'])]
    public function updateDays(DayRepository $dayRepository): Response
    {
        $currentDays = $dayRepository->findBy([], ['timestamp' => 'ASC']);
        $today = strtotime('today');

        $newDays = [];

        foreach ($currentDays as $day) {
            if ($day->getTimestamp() < $today) {
                // Delete all Day objects before today
                $dayRepository->remove($day, true);
            } else {
                // Save timestamps of all currently existing Day objects
                $newDays[] = $day->getTimestamp();
            }
        }

        // Create a single Day object if $newDays is empty
        if (count($newDays) === 0) {
            $day = (new Day())->setTimestamp($today);

            $dayRepository->add($day, true);
            $newDays[] = $day->getTimestamp();
        }

        // Create new Day objects if there are now less than ten Day objects
        if (count($newDays) < 10) {
            while (count($newDays) < 10) {
                $day = (new Day())->setTimestamp(strtotime('+1 day', end($newDays)));

                $dayRepository->add($day, true);
                $newDays[] = $day->getTimestamp();
            }
        }

        // Delete everything after ten days in the future
        if (count($newDays) > 10) {
            $currentDays = $dayRepository->findBy([], ['timestamp' => 'ASC']);

            for ($i = count($newDays) - 1; count($newDays) > 10; $i--) {
                $dayRepository->remove($currentDays[$i], true);

                array_pop($newDays);
            }
        }

        return new Response();
    }
}
