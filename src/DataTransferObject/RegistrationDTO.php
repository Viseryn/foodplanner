<?php namespace App\DataTransferObject;

use App\Entity\User;

/**
 * @implements DataTransferObject<User>
 */
class RegistrationDTO implements DataTransferObject
{
    private ?int $id = null;
    private ?string $username = null;
    private ?string $password = null;
    private ?array $roles = null;

    public function getId(): ?int 
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getUsername(): ?string 
    {
        return $this->username;
    }

    public function setUsername(?string $username): self
    {
        $this->username = $username;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function getRoles(): ?array 
    {
        return $this->roles;
    }

    public function setRoles(?array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }
}
