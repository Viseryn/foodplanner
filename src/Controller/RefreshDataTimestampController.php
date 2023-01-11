<?php

namespace App\Controller;

use App\Repository\RefreshDataTimestampRepository;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RefreshDataTimestampController extends AbstractController
{
    #[Route('/api/refresh-data-timestamp', name: 'api_refresh_data_timestamp')]
    public function refreshDataTimestampApi(
        RefreshDataTimestampRepository $refreshDataTimestampRepository,
    ): Response {
        $timestamp = $refreshDataTimestampRepository->find(1);
        return new JsonResponse($timestamp->getTimestamp());
    }

    #[Route('/api/refresh-data-timestamp/set', name: 'api_refresh_data_timestamp_set')]
    public function refreshDataTimestampSetApi(
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        $refreshDataTimestampUtil->updateTimestamp();

        return new JsonResponse();
    }
}
