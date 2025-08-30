<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Processor\DeleteUserGroupProcessor;
use App\Processor\PatchUserGroupProcessor;
use App\Repository\UserGroupRepository;
use App\Validator\CannotHideLastVisibleGroup;
use App\Validator\CannotHideSomeonesStandardGroup;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Attribute\Ignore;
use Symfony\Component\Validator\Constraints\Count;
use Symfony\Component\Validator\Constraints\NotBlank;

#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['usergroups:read']],
        ),
        new Post(
            uriTemplate: '/user_groups',
            normalizationContext: ['groups' => ['usergroups:read']],
            denormalizationContext: ['groups' => ['usergroups:post']],
        ),
        new Patch(
            normalizationContext: ['groups' => ['usergroups:read']],
            denormalizationContext: ['groups' => ['usergroups:patch']],
            validationContext: ['groups' => ['usergroups:patchValidation']],
            processor: PatchUserGroupProcessor::class,
        ),
        new Delete(
            processor: DeleteUserGroupProcessor::class,
        ),
    ],
    security: "is_granted('ROLE_ADMIN')",
)]
#[ApiFilter(SearchFilter::class, properties: ['hidden' => 'exact'])]
#[ORM\Entity(repositoryClass: UserGroupRepository::class)]
/**
 * TODO: Rename this to "UserCircle" or something more explanatory.
 */
class UserGroup {
    #[Groups(['usergroups:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['usergroups:read', 'usergroups:patch', 'usergroups:post'])]
    #[Count(min: 1)]
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'userGroups')]
    private Collection $users;

    #[Groups(['usergroups:read', 'usergroups:patch', 'usergroups:post'])]
    #[NotBlank]
    #[ORM\Column(length: 64)]
    private ?string $name = null;

    #[Groups(['usergroups:read', 'usergroups:patch', 'usergroups:post'])]
    #[NotBlank]
    #[ORM\Column(length: 255)]
    private ?string $icon = null;

    #[Groups(['usergroups:read'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $readonly = false;

    /** @deprecated Will be replaced by a user setting (user group ordering). Until then, the field is ignored and functionality will be removed. */
    #[Ignore]
    #[ORM\Column(nullable: true)]
    private ?int $position = null;

    #[Groups(['usergroups:read', 'usergroups:patch'])]
    #[CannotHideLastVisibleGroup(groups: ['usergroups:patchValidation'])]
    #[CannotHideSomeonesStandardGroup(groups: ['usergroups:patchValidation'])]
    #[ORM\Column(options: ["default" => false])]
    private ?bool $hidden = false;

    public function __construct() {
        $this->users = new ArrayCollection();
    }

    public function getId(): ?int {
        return $this->id;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection {
        return $this->users;
    }

    /**
     * @param Collection<int, User> $users
     * @return self
     */
    public function setUsers(Collection $users): self {
        $this->users = $users;

        return $this;
    }

    public function addUser(User $user): self {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
        }

        return $this;
    }

    public function removeUser(User $user): self {
        $this->users->removeElement($user);

        return $this;
    }

    public function getName(): ?string {
        return $this->name;
    }

    public function setName(string $name): self {
        $this->name = $name;

        return $this;
    }

    public function getIcon(): ?string {
        return $this->icon;
    }

    public function setIcon(string $icon): self {
        $this->icon = $icon;

        return $this;
    }

    public function isReadonly(): ?bool {
        return $this->readonly;
    }

    public function setReadonly(bool $readonly): static {
        $this->readonly = $readonly;

        return $this;
    }

    /** @deprecated Will be replaced by a user setting (user group ordering). Until then, the field is ignored and functionality will be removed. */
    public function getPosition(): ?int {
        return $this->position;
    }

    /** @deprecated Will be replaced by a user setting (user group ordering). Until then, the field is ignored and functionality will be removed. */
    public function setPosition(int $position): static {
        $this->position = $position;

        return $this;
    }

    public function isHidden(): ?bool {
        return $this->hidden;
    }

    public function setHidden(bool $hidden): static {
        $this->hidden = $hidden;

        return $this;
    }
}
