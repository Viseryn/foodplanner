<?php

namespace App\Controller;

use App\Entity\Day;
use App\Repository\DayRepository;
use App\Service\DayUtil;
use JMS\Serializer\SerializerBuilder;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

#[Route('/api/days')]
class DayController extends AbstractController
{
    /**
     * Days List API
     * 
     * Fetches all Day objects and responds with a JSON
     * array containing all the data, including all Meals
     * that are related to that Day.
     *
     * @param DayRepository $dayRepository
     * @return Response
     */
    #[Route('/list', name: 'api_days_list', methods: ['GET'])]
    public function list(DayRepository $dayRepository, DayUtil $dayUtil, Security $security): Response
    {
        $user = $security->getUser();
        
        // Deny access if not logged in
        if (!in_array('ROLE_ADMIN', $user->getRoles())) {
            return new JsonResponse();
        }

        $daysResult = $dayRepository->findBy([], ['timestamp' => 'ASC']);
        $preparedDays = $dayUtil->getApiModels($daysResult);

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($preparedDays, 'json');

        return (new JsonResponse($jsonContent));
    }

    /**
     * Days Update API
     * 
     * Deletes all past Day objects and creates new Day objects up 
     * to ten days in the future.
     *
     * @param DayRepository $dayRepository
     * @return Response
     */
    #[Route('/update', name: 'api_days_update', methods: ['GET'])]
    public function updateDays(DayUtil $dayUtil): Response
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $dayUtil->updateDays();

        return new Response();
    }
}
