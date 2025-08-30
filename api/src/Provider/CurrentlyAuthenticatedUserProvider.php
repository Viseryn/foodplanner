<?php

namespace App\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;

final readonly class CurrentlyAuthenticatedUserProvider implements ProviderInterface {

    public function __construct(
        private Security $security,
    ) {}

    public function provide(Operation $operation = null, array $uriVariables = [], array $context = []): User {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            return new User();
        }

        return $user;
    }
}
