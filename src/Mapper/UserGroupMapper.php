<?php namespace App\Mapper;

use App\DataTransferObject\UserGroupDTO;
use App\Entity\UserGroup;

/**
 * @implements Mapper<UserGroup>
 */
final class UserGroupMapper implements Mapper
{
    public function __construct(
        private readonly UserMapper $userMapper,
    ) {}

    /**
     * @param UserGroupDTO $dto
     * @return UserGroup
     */
    public function dtoToEntity($dto): UserGroup
    {
        $userGroup = (new UserGroup)->setName($dto->getName())
                                    ->setIcon($dto->getIcon())
                                    ->setReadonly($dto->getReadonly())
                                    ->setHidden($dto->getHidden())
                                    ->setPosition($dto->getPosition());

        $users = $dto->getUsers()->map(fn ($userDto) => $this->userMapper->dtoToEntity($userDto));
        foreach ($users as $user) {
            $userGroup->addUser($user);
        }

        return $userGroup;
    }

    /**
     * @param UserGroup $entity
     * @return UserGroupDTO
     */
    public function entityToDto($entity): UserGroupDTO
    {
        return (new UserGroupDTO)->setId($entity->getId())
                                 ->setName($entity->getName())
                                 ->setIcon($entity->getIcon())
                                 ->setReadonly($entity->isReadonly())
                                 ->setHidden($entity->isHidden())
                                 ->setPosition($entity->getPosition())
                                 ->setUsers(
                                     $entity->getUsers()->map(fn ($user) => $this->userMapper->entityToDto($user)),
                                 );
    }
}
