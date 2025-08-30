<?php

namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Recipe;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;

final readonly class DeleteRecipeProcessor implements ProcessorInterface {

    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []) {
        if (!$data instanceof Recipe) {
            throw new InvalidArgumentException("Expected instance of Recipe");
        }

        $data->setDeleted(true);
        $this->entityManager->flush();

        return $data;
    }
}
