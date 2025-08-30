<?php

namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\RecipeListViewMode;
use App\Entity\Role;
use App\Entity\Settings;
use App\Entity\User;
use App\Entity\UserGroup;
use App\Repository\SettingsRepository;
use App\Repository\UserGroupRepository;
use App\Service\RefreshDataTimestampUtil;
use Doctrine\ORM\EntityNotFoundException;

final readonly class RegistrationProcessor implements ProcessorInterface {

    public function __construct(
        private UserPasswordHasher $userPasswordHasher,
        private SettingsRepository $settingsRepository,
        private UserGroupRepository $userGroupRepository,
        private RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []) {
        if (!$data instanceof User) {
            throw new EntityNotFoundException();
        }

        $data->setActive(false)->setRoles([Role::USER]);

        $user = $this->userPasswordHasher->process($data, $operation, $uriVariables, $context);

        $this->createUserSettings($user);
        $this->createUserGroup($user);
        $this->addToEveryoneGroup($user);

        $this->refreshDataTimestampUtil->updateTimestamp();

        return $user;
    }

    private function createUserSettings(User $user): void {
        $settings = (new Settings)
            ->setUser($user)
            ->setShowPantry(true)
            ->setRecipeListViewMode(RecipeListViewMode::GRID);

        $this->settingsRepository->save($settings, true);
    }

    private function createUserGroup(User $user): void {
        $userGroup = (new UserGroup)
            ->addUser($user)
            ->setName($user->getUsername())
            ->setIcon("face")
            ->setReadonly(true)
            ->setHidden(false);

        $this->userGroupRepository->save($userGroup, true);
    }

    private function addToEveryoneGroup(User $user): void {
        $everyoneGroup = $this->userGroupRepository->findEveryoneGroup();
        $everyoneGroup->addUser($user);
    }
}
