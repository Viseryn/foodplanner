<?php namespace App\Service;

use App\Entity\Settings;
use App\Entity\User;
use App\Entity\UserGroup;
use App\Repository\SettingsRepository;
use App\Repository\UserGroupRepository;

final class RegistrationControllerService
{
    public function __construct(
        private readonly SettingsRepository $settingsRepository,
        private readonly UserGroupRepository $userGroupRepository,
    ) {
    }

    public function createUserSettings(User $user): void
    {
        $settings = (new Settings)->setUser($user)
                                  ->setShowPantry(true)
                                  ->setRecipeListViewMode("GRID");
        $this->settingsRepository->save($settings, true);
    }

    public function createUserGroup(User $user): void
    {
        $userGroup = (new UserGroup)->addUser($user)
                                    ->setName($user->getUsername())
                                    ->setIcon("face") // TODO [Issue #192]
                                    ->setReadonly(true)
                                    ->setHidden(false)
                                    ->setPosition($this->userGroupRepository->getMaxPosition());
        $this->userGroupRepository->add($userGroup, true);
    }

    public function addToEveryoneGroup(User $user): void
    {
        $everyoneGroup = $this->userGroupRepository->findOneBy(['position' => 0]);
        $everyoneGroup->addUser($user);
    }
}
