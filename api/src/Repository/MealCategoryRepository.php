<?php

namespace App\Repository;

use App\Entity\MealCategory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<MealCategory>
 *
 * @method MealCategory|null find($id, $lockMode = null, $lockVersion = null)
 * @method MealCategory|null findOneBy(array $criteria, array $orderBy = null)
 * @method MealCategory[]    findAll()
 * @method MealCategory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MealCategoryRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, MealCategory::class);
    }
}
