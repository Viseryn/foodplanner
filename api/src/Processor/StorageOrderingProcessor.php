<?php
namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\StorageOrdering;
use App\Provider\StorageProvider;
use App\Service\RefreshDataTimestampUtil;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

readonly class StorageOrderingProcessor implements ProcessorInterface {

    public function __construct(
        private EntityManagerInterface $entityManager,
        private RefreshDataTimestampUtil $refreshDataTimestampUtil,
        private StorageProvider $storageProvider,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []) {
        if (!$data instanceof StorageOrdering) {
            throw new \InvalidArgumentException("Expected instance of StorageOrdering");
        }

        $allIngredients = $this->storageProvider->provide($operation, $uriVariables, $context)->getIngredients();

        if ($allIngredients->count() !== count($data->getIngredients())) {
            return (new Response)->setStatusCode(400);
        }

        $step = 10;

        foreach (array_reverse($data->getIngredients()) as $index => $ingredient) {
            if (!$allIngredients->contains($ingredient)) {
                return (new Response)->setStatusCode(400);
            }

            $ingredient->setPosition(($index + 1) * $step);
        }

        $this->entityManager->flush();

        $this->refreshDataTimestampUtil->updateTimestamp();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
