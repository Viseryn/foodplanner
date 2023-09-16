<?php

namespace App\Controller;

use App\Component\Response\PrettyJsonResponse;
use App\Entity\Settings;
use App\Repository\MealCategoryRepository;
use App\Repository\SettingsRepository;
use App\Repository\UserGroupRepository;
use App\Repository\UserRepository;
use App\Service\DtoResponseService;
use App\Service\UserControllerService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Settings API
 */
#[Route('/api/settings')]
class SettingsController extends AbstractControllerWithMapper
{
    public function __construct(
        private readonly MealCategoryRepository $mealCategoryRepository,
        private readonly SettingsRepository $settingsRepository,
        private readonly UserControllerService $userControllerService,
        private readonly UserGroupRepository $userGroupRepository,
        private readonly UserRepository $userRepository,
    ) {
        parent::__construct(Settings::class);
    }

    #[Route('', name: 'api_settings_get', methods: ['GET'])]
    public function get(#[MapQueryParameter] ?int $userid): Response
    {
        $user = $this->userRepository->find($userid ?: 0);
        if ($user?->getId() !== $this->userControllerService->getUser()->getId()) {
            return new PrettyJsonResponse(null, 403);
        }

        $settings = $this->settingsRepository->findOneBy(['user' => $user->getId()]);
        return DtoResponseService::getResponse($this->mapper->entityToDto($settings));
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
        return DtoResponseService::getResponse($this->mapper->entityToDto($settings));
    }
}
