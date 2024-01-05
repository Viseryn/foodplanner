<?php

namespace App\Controller;

use App\Service\DayControllerService;
use App\Service\DtoResponseService;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Day API
 */
#[Route('/api/days')]
class DayController extends AbstractController
{
    public function __construct(
        private readonly DayControllerService $dayControllerService,
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ) {
    }

    #[Route('', name: 'api_days_get', methods: ['GET'])]
    public function get(): Response
    {
        $dayDTOs = $this->dayControllerService->getAllDays();
        return DtoResponseService::getResponse($dayDTOs);
    }

    /**
     * Deletes all past Day objects and creates new Day objects up to ten days in the future.
     * @todo [Issue #245] Only update timestamp when there were changes
     */
    #[Route('', name: 'api_days_patch', methods: ['PATCH'])]
    public function patch(): Response
    {
        $this->dayControllerService->updateDays();
        $this->refreshDataTimestampUtil->updateTimestamp();
        return new Response(null, 200);
    }
}
