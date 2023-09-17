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
     * @param D|null $dto
     * @return E|null
     */
    public function dtoToEntity($dto);

    /**
     * @param E|null $entity
     * @return D|null
     */
    public function entityToDto($entity);
}