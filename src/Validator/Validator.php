<?php namespace App\Validator;

use App\DataTransferObject\DataTransferObject;
use App\Entity\EntityInterface;

interface Validator
{
    public function validateDto(DataTransferObject $dto): void;

    public function validateEntity(EntityInterface $entity): void;
}