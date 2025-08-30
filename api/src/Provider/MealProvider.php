<?php

namespace App\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Meal;
use Doctrine\ORM\EntityManagerInterface;

final readonly class MealProvider implements ProviderInterface {

    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null {
        return $this->entityManager
            ->createQueryBuilder()
            ->select('meal')
            ->from(Meal::class, 'meal')
            ->join('meal.recipe', 'recipe')
            ->andWhere('recipe.deleted IS NULL OR recipe.deleted = false')
            ->andWhere('meal.date >= :today')
            ->setParameter('today', new \DateTimeImmutable("today"))
            ->getQuery()
            ->getResult();
    }
}
