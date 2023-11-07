<?php namespace App\Service;

use App\Entity\Settings;
use App\Entity\User;
use App\Repository\SettingsRepository;

final class RegistrationControllerService
{
    public function __construct(
        private SettingsRepository $settingsRepository,
    ) {}

    public function createUserSettings(User $user): void
    {
        $settings = (new Settings)
            ->setUser($user)
            ->setShowPantry(true)
            ->setRecipeListViewMode("GRID");
        $this->settingsRepository->save($settings, true);
    }
}
