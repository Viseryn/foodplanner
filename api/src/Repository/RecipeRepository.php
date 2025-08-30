<?php

namespace App\Repository;

use App\Entity\Recipe;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Recipe>
 *
 * @method Recipe|null find($id, $lockMode = null, $lockVersion = null)
 * @method Recipe|null findOneBy(array $criteria, array $orderBy = null)
 * @method Recipe[]    findAll()
 * @method Recipe[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RecipeRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, Recipe::class);
    }

    public function save(Recipe $entity, bool $flush = false): void {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Recipe $entity, bool $flush = false): void {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findUndeleted(int $id): ?Recipe {
        $recipe = $this->find($id);

        if ($recipe->isDeleted()) {
            return null;
        } else {
            return $recipe;
        }
    }

    public function findAllBy(bool $deleted) {
        $query = $this->getEntityManager()
            ->createQueryBuilder()
            ->select('recipe')
            ->from(Recipe::class, 'recipe');

        if ($deleted) {
            $query->andWhere('recipe.deleted = true');
        } else {
            $query->andWhere('recipe.deleted IS NULL OR recipe.deleted = false');
        }

        return $query
            ->orderBy('recipe.title', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
