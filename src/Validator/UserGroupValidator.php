<?php namespace App\Validator;

use App\Component\Exception\ValidationFailedException;
use App\DataTransferObject\UserGroupDTO;
use App\Entity\EntityInterface;
use Symfony\Component\Serializer\Exception\UnsupportedException;

class UserGroupValidator implements Validator
{
    /**
     * @param UserGroupDTO $dto
     * @return void
     * @throws ValidationFailedException
     */
    public function validateDto($dto): void
    {
        if (strlen($dto->getName()) < 1
            || strlen($dto->getIcon()) < 1
            || count($dto->getUsers()) < 1) {
            throw new ValidationFailedException("Each field must not be empty.");
        }
    }

    public function validateEntity(EntityInterface $entity): void
    {
        throw new UnsupportedException();
    }
}