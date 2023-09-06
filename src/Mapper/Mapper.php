<?php namespace App\Mapper;

use App\DataTransferObject\DataTransferObject;
use App\Entity\EntityInterface;

/**
 * @template E of EntityInterface
 * @template D of DataTransferObject<E>
 */
interface Mapper
{
    /**
     * @param D $dto
     * @return E
     */
    public function dtoToEntity($dto);

    /**
     * @param E $entity
     * @return D
     */
    public function entityToDto($entity);
}