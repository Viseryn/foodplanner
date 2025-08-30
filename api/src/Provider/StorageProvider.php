<?php

namespace App\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Storage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final readonly class StorageProvider implements ProviderInterface {

    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function provide(Operation $operation = null, array $uriVariables = [], array $context = []): Storage {
        $storage = $this->entityManager->getRepository(Storage::class)->findOneBy(['id' => $uriVariables['storageId']]);

        if (!$storage instanceof Storage) {
            throw new NotFoundHttpException();
        }

        return $storage;
    }
}
