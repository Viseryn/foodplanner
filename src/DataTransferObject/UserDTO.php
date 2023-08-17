<?php namespace App\DataTransferObject;

use App\Entity\User;

class UserDTO implements DataTransferObjectWithOptionField
{
    private ?int $id;
    private ?string $username;
    private ?array $roles;
    private ?FormOptionFieldDTO $option;

    public function __construct(User $user)
    {
        $this->id = $user->getId();
        $this->username = $user->getUsername();
        $this->roles = $user->getRoles();
        $this->option = new SelectOptionDTO($this->getId(), $this->getUsername());
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

    public function getOption(): ?FormOptionFieldDTO
    {
        return $this->option;
    }
}
