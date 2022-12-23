<?php

namespace App\Controller;

use App\Repository\SettingsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/settings')]
class SettingsController extends AbstractController
{
    /**
     * Settings API
     * 
     * Responds with an array of settings.
     *
     * @param SettingsRepository $settingsRepository
     * @return Response
     */
    #[Route('/', name: 'api_settings')]
    public function settings(
        SettingsRepository $settingsRepository
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Fetch settings from database
        $settings = $settingsRepository->find(1);

        // Prepare response
        $response = json_encode([
            'showPantry' => $settings->isShowPantry(),
        ]);

        // Respond pantry settings
        return new JsonResponse($response);
    }
    
    /**
     * Update Pantry Settings API
     * 
     * Updates the Pantry Settings.
     *
     * @param Request $request
     * @param SettingsRepository $settingsRepository
     * @return Response
     */
    #[Route('/pantry', name: 'api_settings_pantry', methods: ['GET', 'POST'])]
    public function updatePantry(
        Request $request,
        SettingsRepository $settingsRepository
    ): Response {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Fetch request content
        $requestContent = json_decode($request->getContent(), true);

        // Update pantry settings
        $settings = $settingsRepository->find(1);
        $settings->setShowPantry($requestContent['showPantry']);
        $settingsRepository->save($settings, true);

        // Empty response
        return new Response();
    }
}
