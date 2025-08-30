<?php

namespace App\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\RefreshDataTimestamp;
use Doctrine\ORM\EntityManagerInterface;

final readonly class RefreshDataTimestampProvider implements ProviderInterface {

    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): RefreshDataTimestamp {
        return $this->entityManager->getRepository(RefreshDataTimestamp::class)->findOneBy([]);
    }
}
