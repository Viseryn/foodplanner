<?php

namespace App\Controller;

use App\Repository\SettingsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Settings API
 */
#[Route('/api/settings')]
class SettingsController extends AbstractController
{
    /**
     * Settings Detail API
     * 
     * Responds with an array of settings.
     *
     * @param SettingsRepository $settingsRepository
     * @return Response
     * 
     * @todo Create a type specification.
     * @todo How do you assert getId()'s existence?
     */
    #[Route('/detail', name: 'api_settings_detail')]
    public function detail(SettingsRepository $settingsRepository): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $settings = $settingsRepository->findOneBy([
            'user' => $this->getUser()?->getId()
        ]);

        $response = json_encode([
            'showPantry' => $settings->isShowPantry(),
        ]);

        return new JsonResponse($response);
    }
    
    /**
     * Settings Update Pantry API
     * 
     * Updates the Pantry Settings.
     *
     * @param Request $request
     * @param SettingsRepository $settingsRepository
     * @return Response
     * 
     * @todo How do you assert getId()'s existence?
     */
    #[Route('/updatePantry', name: 'api_settings_update_pantry', methods: ['GET', 'POST'])]
    public function updatePantry(
        Request $request,
        SettingsRepository $settingsRepository
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = json_decode($request->getContent(), true);

        $settings = $settingsRepository->findOneBy([
            'user' => $this->getUser()?->getId()
        ]);
        $settings->setShowPantry($requestContent['showPantry']);
        $settingsRepository->save($settings, true);

        return new Response();
    }
}
