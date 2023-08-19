<?php

namespace App\Controller;

use App\Component\Response\PrettyJsonResponse;
use App\DataTransferObject\DTOSerializer;
use App\DataTransferObject\SettingsDTO;
use App\Entity\Settings;
use App\Repository\MealCategoryRepository;
use App\Repository\SettingsRepository;
use App\Repository\UserGroupRepository;
use App\Repository\UserRepository;
use App\Service\UserControllerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Settings API
 */
#[Route('/api/settings')]
class SettingsController extends AbstractController
{
    public function __construct(
        private MealCategoryRepository $mealCategoryRepository,
        private SettingsRepository $settingsRepository,
        private UserControllerService $userControllerService,
        private UserGroupRepository $userGroupRepository,
        private UserRepository $userRepository,
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

    #[Route('/{id}', name: 'api_settings_patch', methods: ['PATCH'])]
    public function patch(Request $request, Settings $settings): Response
    {
        $data = json_decode($request->getContent(), false);

        if (property_exists($data, "showPantry") && is_bool($data->showPantry)) {
            $settings->setShowPantry($data->showPantry);
        }

        if (property_exists($data, "standardUserGroup") && is_int($data->standardUserGroup->id)) {
            $userGroup = $this->userGroupRepository->find($data->standardUserGroup->id);
            $settings->setStandardUserGroup($userGroup);
        }

        if (property_exists($data, "standardMealCategory") && is_int($data->standardMealCategory->id)) {
            $mealCategory = $this->mealCategoryRepository->find($data->standardMealCategory->id);
            $settings->setStandardMealCategory($mealCategory);
        }

        $this->settingsRepository->save($settings, true);
        return DTOSerializer::getResponse(new SettingsDTO($settings));
    }
}
