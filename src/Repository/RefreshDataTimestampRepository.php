<?php

namespace App\Repository;

use App\Entity\RefreshDataTimestamp;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RefreshDataTimestamp>
 *
 * @method RefreshDataTimestamp|null find($id, $lockMode = null, $lockVersion = null)
 * @method RefreshDataTimestamp|null findOneBy(array $criteria, array $orderBy = null)
 * @method RefreshDataTimestamp[]    findAll()
 * @method RefreshDataTimestamp[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RefreshDataTimestampRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RefreshDataTimestamp::class);
    }

    public function save(RefreshDataTimestamp $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(RefreshDataTimestamp $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return RefreshDataTimestamp[] Returns an array of RefreshDataTimestamp objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?RefreshDataTimestamp
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
