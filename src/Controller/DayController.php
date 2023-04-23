<?php

namespace App\Controller;

use App\Repository\DayRepository;
use App\Service\DayUtil;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Day API
 */
#[Route('/api/days')]
class DayController extends AbstractController
{
    /**
     * Days List API
     * 
     * Responds with an array of JSON objects matching the type specifications of DayModel.ts.
     *
     * @param DayRepository $dayRepository
     * @param DayUtil $dayUtil
     * @return Response
     */
    #[Route('/list', name: 'api_days_list', methods: ['GET'])]
    public function list(DayRepository $dayRepository, DayUtil $dayUtil): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $daysResult = $dayRepository->findBy([], ['timestamp' => 'ASC']);

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($dayUtil->getApiModels($daysResult), 'json');

        return (new JsonResponse($jsonContent));
    }

    /**
     * Days Update API
     * 
     * Deletes all past Day objects and creates new Day objects up to ten days in the future.
     *
     * @param DayUtil $dayUtil
     * @return Response
     */
    #[Route('/update', name: 'api_days_update', methods: ['GET'])]
    public function updateDays(DayUtil $dayUtil): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $dayUtil->updateDays();

        return new Response();
    }
}
