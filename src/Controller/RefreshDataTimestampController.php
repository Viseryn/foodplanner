<?php

namespace App\Controller;

use App\Repository\RefreshDataTimestampRepository;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * RefreshDataTimestamp API
 */
class RefreshDataTimestampController extends AbstractController
{
    /**
     * RefreshDataTimestamp Get API
     *
     * @param RefreshDataTimestampRepository $refreshDataTimestampRepository
     * @return Response
     */
    #[Route('/api/refresh-data-timestamp', name: 'api_refresh_data_timestamp')]
    public function refreshDataTimestampApi(
        RefreshDataTimestampRepository $refreshDataTimestampRepository,
    ): Response {
        $timestamp = $refreshDataTimestampRepository->find(1);
        return new JsonResponse($timestamp->getTimestamp());
    }

    /**
     * RefreshDataTimestamp Set API
     *
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @return Response
     */
    #[Route('/api/refresh-data-timestamp/set', name: 'api_refresh_data_timestamp_set')]
    public function refreshDataTimestampSetApi(
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ): Response {
        $refreshDataTimestampUtil->updateTimestamp();

        return new JsonResponse();
    }
}
