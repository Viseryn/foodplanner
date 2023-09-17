<?php namespace App\Service;

use App\Entity\User;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserControllerService
{
    public function __construct(
        private readonly Security $security,
        private ?User $user = null,
    ) {
        $this->user = $this->castToUserInstance($this->security->getUser());
    }

    public function getUser(): User
    {
        return $this->user;
    }

    private static function castToUserInstance(UserInterface|User|null $user): User
    {
        return $user ?: new User;
    }
}
