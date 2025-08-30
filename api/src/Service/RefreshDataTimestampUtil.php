<?php

namespace App\Service;

use App\Entity\RefreshDataTimestamp;
use Doctrine\ORM\EntityManagerInterface;

final readonly class RefreshDataTimestampUtil {
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    /**
     * Updates the timestamp of the RefreshDataTimestamp object to the current timestamp (integer).
     *
     * @return self
     */
    public function updateTimestamp(): self {
        $timestamp = $this->entityManager->getRepository(RefreshDataTimestamp::class)->findOneBy([]);
        $timestamp->setTimestamp(time());

        $this->entityManager->persist($timestamp);
        $this->entityManager->flush();

        return $this;
    }
}
