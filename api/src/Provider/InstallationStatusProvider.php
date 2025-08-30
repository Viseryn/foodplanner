<?php

namespace App\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\InstallationStatus;
use Doctrine\ORM\EntityManagerInterface;

final readonly class InstallationStatusProvider implements ProviderInterface {

    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null {
        return $this->entityManager->getRepository(InstallationStatus::class)->findOneBy([]);
    }
}
