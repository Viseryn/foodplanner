<?php namespace App\DataTransferObject;

use App\Entity\UserGroup;
use Doctrine\Common\Collections\Collection;

class UserGroupDTO implements DataTransferObject
{
    private ?int $id;
    private ?string $name;
    private ?string $icon;
    /** @var Collection<UserDTO> */
    private Collection $users;

    public function __construct(UserGroup $userGroup)
    {
        $this->id = $userGroup->getId();
        $this->name = $userGroup->getName();
        $this->icon = $userGroup->getIcon();
        $this->users = $userGroup->getUsers()->map(fn ($user) => new UserDTO($user));
    }

    public function getId(): ?int 
    {
        return $this->id;
    }

    public function getName(): ?string 
    {
        return $this->name;
    }

    public function getIcon(): ?string 
    {
        return $this->icon;
    }

    /** @return Collection<UserDTO> */
    public function getUsers(): Collection
    {
        return $this->users;
    }
}
