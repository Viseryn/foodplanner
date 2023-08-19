<?php namespace App\DataTransferObject;

use App\Entity\User;

class UserDTO implements DataTransferObject
{
    private ?int $id;
    private ?string $username;
    private ?array $roles;

    public function __construct(User $user)
    {
        $this->id = $user->getId();
        $this->username = $user->getUsername();
        $this->roles = $user->getRoles();
    }

    public function getId(): ?int 
    {
        return $this->id;
    }

    public function getUsername(): ?string 
    {
        return $this->username;
    }

    public function getRoles(): ?array 
    {
        return $this->roles;
    }
}
