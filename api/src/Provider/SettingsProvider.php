<?php

namespace App\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Settings;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final readonly class SettingsProvider implements ProviderInterface {

    public function __construct(
        private CurrentlyAuthenticatedUserProvider $currentlyAuthenticatedUserProvider,
        private EntityManagerInterface $entityManager,
    ) {}

    public function provide(Operation $operation = null, array $uriVariables = [], array $context = []): Settings {
        $user = $this->currentlyAuthenticatedUserProvider->provide();
        $settings = $this->entityManager->getRepository(Settings::class)->findOneBy(['user' => $user]);

        if (!$settings instanceof Settings) {
            throw new NotFoundHttpException();
        }

        return $settings;
    }
}
