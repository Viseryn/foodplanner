<?php namespace App\DataTransferObject;

use App\Entity\EntityInterface;

/**
 * @template E of EntityInterface
 */
interface DataTransferObject
{
    public function getId(): int|null;

    public function setId(int|null $id): self;
}
