<?php namespace App\Service;

use App\Entity\EntityInterface;
use App\Entity\User;

/**
 * UserUtil
 */
class UserUtil extends EntityUtil
{
    /** @param User $user */
    public function getApiModel(EntityInterface $user): array
    {
        return [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'roles' => $user->getRoles(),
            'option' => [
                'id' => $user->getId(),
                'label' => $user->getUsername(),
            ],
        ];
    }
}
