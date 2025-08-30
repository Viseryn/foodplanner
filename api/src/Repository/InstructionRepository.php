<?php

namespace App\Repository;

use App\Entity\Instruction;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Instruction>
 *
 * @method Instruction|null find($id, $lockMode = null, $lockVersion = null)
 * @method Instruction|null findOneBy(array $criteria, array $orderBy = null)
 * @method Instruction[]    findAll()
 * @method Instruction[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InstructionRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, Instruction::class);
    }

    public function save(Instruction $entity, bool $flush = false): void {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Instruction $entity, bool $flush = false): void {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
