<?php namespace App\Validator;

use App\Component\Exception\ValidationFailedException;
use App\DataTransferObject\RegistrationDTO;
use App\Entity\EntityInterface;
use Symfony\Component\Serializer\Exception\UnsupportedException;

class RegistrationValidator implements Validator
{
    /**
     * @param RegistrationDTO $dto
     * @return void
     * @throws ValidationFailedException
     */
    public function validateDto($dto): void
    {
        if (strlen($dto->getUsername()) < 1) {
            throw new ValidationFailedException("Username must not be empty.");
        }

        if (strlen($dto->getPassword()) < 1) {
            throw new ValidationFailedException("Password must not be empty.");
        }

        if ($dto->getRoles() != ["ROLE_USER"]) {
            throw new ValidationFailedException("User roles were illegally modified.");
        }
    }

    public function validateEntity(EntityInterface $entity): void
    {
        throw new UnsupportedException();
    }
}