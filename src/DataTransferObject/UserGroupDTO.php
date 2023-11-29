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
    private ?bool $readonly = null;
    private ?bool $hidden = null;
    private ?int $position = null;
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

    public function getReadonly(): ?bool
    {
        return $this->readonly;
    }

    public function setReadonly(?bool $readonly): self
    {
        $this->readonly = $readonly;
        return $this;
    }

    public function getHidden(): ?bool
    {
        return $this->hidden;
    }

    public function setHidden(?bool $hidden): self
    {
        $this->hidden = $hidden;
        return $this;
    }

    public function getPosition(): ?int
    {
        return $this->position;
    }

    public function setPosition(?int $position): self
    {
        $this->position = $position;
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
