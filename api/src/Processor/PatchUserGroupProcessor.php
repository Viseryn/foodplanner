<?php

namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Entity\UserGroup;
use App\Repository\UserGroupRepository;
use App\Repository\UserRepository;
use InvalidArgumentException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

final readonly class PatchUserGroupProcessor implements ProcessorInterface {

    public function __construct(
        private UserGroupRepository $userGroupRepository,
        private UserRepository $userRepository,
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []) {
        if (!$data instanceof UserGroup) {
            throw new InvalidArgumentException("Expected instance of UserGroup");
        }

        if ($data->isReadonly()) {
            // Case 1: The "Everyone" group
            if ($data->getId() === $this->userGroupRepository->findEveryoneGroup()->getId()) {
                $allUserIds = array_map(fn (User $user) => $user->getId(), $this->userRepository->findAll());
                $groupUserIds = $data->getUsers()->map(fn (User $user) => $user->getId())->toArray();

                if ($groupUserIds != $allUserIds) {
                    throw new MethodNotAllowedHttpException([], "You cannot remove users from this group.");
                }

                if ($data->getName() != "Alle") { // TODO: This string needs to be a constant!
                    throw new MethodNotAllowedHttpException([], "You cannot change the name of this group.");
                }
            }

            // Case 2: The user specific groups
            else {
                $userSpecificGroup = $this->userGroupRepository->find($data->getId());
                /** @var User $correspondingUser */
                $correspondingUser = $userSpecificGroup?->getUsers()?->first();

                if ($data->getUsers()->map(fn (User $user) => $user->getId())->toArray() != [$correspondingUser->getId()]) {
                    throw new MethodNotAllowedHttpException([], "You cannot change the users of this group.");
                }

                if ($data->getName() != $correspondingUser->getUsername()) {
                    throw new MethodNotAllowedHttpException([], "You cannot change the name of this group.");
                }
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
