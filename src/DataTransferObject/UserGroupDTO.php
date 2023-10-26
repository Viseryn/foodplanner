<?php namespace App\DataTransferObject;

use Doctrine\Common\Collections\ReadableCollection;

/**
 * @implements DataTransferObject<UserGroup>
 */
class UserGroupDTO implements DataTransferObject
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $icon = null;
    /** @var ReadableCollection<UserDTO>|null */
    private ?ReadableCollection $users = null;

    public function getId(): ?int 
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string 
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getIcon(): ?string 
    {
        return $this->icon;
    }

    public function setIcon(?string $icon): self
    {
        $this->icon = $icon;
        return $this;
    }

    /** @return ReadableCollection<UserDTO>|null */
    public function getUsers(): ?ReadableCollection
    {
        return $this->users;
    }

    /**
     * @param ReadableCollection<UserDTO>|null $users
     * @return UserGroupDTO
     */
    public function setUsers(?ReadableCollection $users): self
    {
        $this->users = $users;
        return $this;
    }
}
