<?php

namespace App\Repository;

use App\Entity\InstallationStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<InstallationStatus>
 *
 * @method InstallationStatus|null find($id, $lockMode = null, $lockVersion = null)
 * @method InstallationStatus|null findOneBy(array $criteria, array $orderBy = null)
 * @method InstallationStatus[]    findAll()
 * @method InstallationStatus[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InstallationStatusRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, InstallationStatus::class);
    }

    public function save(InstallationStatus $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return InstallationStatus[] Returns an array of InstallationStatus objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('i')
//            ->andWhere('i.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('i.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?InstallationStatus
//    {
//        return $this->createQueryBuilder('i')
//            ->andWhere('i.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
