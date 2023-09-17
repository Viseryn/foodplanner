<?php namespace App\Mapper;

use App\DataTransferObject\UserDTO;
use App\Entity\User;

/**
 * @implements Mapper<User>
 */
final class UserMapper implements Mapper
{
    /**
     * @param UserDTO $dto
     * @return User
     */
    public function dtoToEntity($dto): User
    {
        return (new User)->setUsername($dto->getUsername())
                         ->setRoles($dto->getRoles());
    }

    /**
     * @param User $entity
     * @return UserDTO
     */
    public function entityToDto($entity): UserDTO
    {
        return (new UserDTO)->setId($entity->getId())
                            ->setUsername($entity->getUsername())
                            ->setRoles($entity->getRoles());
    }
}
