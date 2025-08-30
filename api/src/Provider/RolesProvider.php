<?php

namespace App\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Role;

final readonly class RolesProvider implements ProviderInterface {
    public function provide(Operation $operation = null, array $uriVariables = [], array $context = []): array {
        return array_map(fn ($role) => new \App\ApiResource\Role($role->value), Role::cases());
    }
}
