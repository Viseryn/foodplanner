<?php

namespace App\Controller;

use App\Component\Response\PrettyJsonResponse;
use App\DataTransferObject\DTOSerializer;
use App\DataTransferObject\SettingsDTO;
use App\Entity\User;
use App\Repository\SettingsRepository;
use App\Repository\UserRepository;
use App\Service\SettingsUtil;
use App\Service\UserControllerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Annotation\Route;
use JMS\Serializer\SerializerBuilder;

/**
 * Settings API
 */
#[Route('/api/settings')]
class SettingsController extends AbstractController
{
    public function __construct(
        private SettingsRepository $settingsRepository,
        private UserRepository $userRepository,
        private UserControllerService $userControllerService,
    ) {}

    #[Route('', name: 'api_settings_get', methods: ['GET'])]
    public function get(#[MapQueryParameter] int $userid = 1): Response
    {
        $user = $this->userRepository->find($userid);
        if ($user?->getId() !== $this->userControllerService->getUser()->getId()) {
            return new PrettyJsonResponse(null, 403);
        }

        $settings = $this->settingsRepository->findOneBy(['user' => $user->getId()]);
        return DTOSerializer::getResponse(new SettingsDTO($settings));
    }
    
    /**
     * Settings Update Pantry API
     * 
     * Updates the Pantry Settings.
     *
     * @param Request $request
     * @param SettingsRepository $settingsRepository
     * @return Response
     */
    #[Route('/updatePantry', name: 'api_settings_update_pantry', methods: ['GET', 'POST'])]
    public function updatePantry(
        Request $request,
        SettingsRepository $settingsRepository
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = json_decode($request->getContent(), true);

        $castToUser = function(null|UserInterface|User $userParam): User {
            return $userParam ?: new User;
        };

        $settings = $settingsRepository->findOneBy([
            'user' => $castToUser($this->getUser())?->getId()
        ]);

        $settings->setShowPantry($requestContent['showPantry']);
        $settingsRepository->save($settings, true);

        return new Response();
    }
}
