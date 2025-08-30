<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use App\Processor\RegistrationProcessor;
use App\Processor\UserPasswordHasher;
use App\Provider\CurrentlyAuthenticatedUserProvider;
use App\Repository\UserRepository;
use App\Validator\AtLeastOneActiveAdmin;
use App\Validator\HasUserRole;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\Ignore;
use Symfony\Component\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/users/{id}',
            requirements: ['id' => '\d+'],
            normalizationContext: ['groups' => ['user:read']],
            security: "is_granted('ROLE_USER_ADMINISTRATION')",
        ),
        new Get(
            uriTemplate: '/users/me',
            openapi: new Operation(
                description: 'Retrieves the User resource of the currently authenticated user.',
            ),
            normalizationContext: ['groups' => ['user:read']],
            provider: CurrentlyAuthenticatedUserProvider::class,
        ),
        new GetCollection(
            normalizationContext: ['groups' => ['users:read']],
            security: "is_granted('ROLE_ADMIN')",
        ),
        new Patch(
            uriTemplate: '/users/me',
            openapi: new Operation(
                description: 'Updates the User resource of the currently authenticated user.',
            ),
            normalizationContext: ['groups' => ['user:read']],
            denormalizationContext: ['groups' => ['ownuser:patch']],
            security: "is_granted('ROLE_USER')",
            validationContext: ['groups' => ['ownuser:patchValidation']],
            read: true,
            provider: CurrentlyAuthenticatedUserProvider::class,
            processor: UserPasswordHasher::class,
        ),
        new Patch(
            uriTemplate: '/users/{id}',
            requirements: ['id' => '\d+'],
            normalizationContext: ['groups' => ['user:read']],
            denormalizationContext: ['groups' => ['user:patch']],
            security: "is_granted('ROLE_USER_ADMINISTRATION')",
            validationContext: ['groups' => ['user:patchValidation']],
            read: true,
            processor: UserPasswordHasher::class,
        ),
        new Post(
            uriTemplate: '/users',
            normalizationContext: ['groups' => ['user:read']],
            denormalizationContext: ['groups' => ['user:post']],
            validationContext: ['groups' => ['user:postValidation']],
            processor: RegistrationProcessor::class,
        ),
    ],
)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity(fields: ['username'], message: 'There is already an account with this username')]
class User implements UserInterface, PasswordAuthenticatedUserInterface {
    #[Groups(['users:read', 'user:read', 'usergroups:read'])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['users:read', 'user:read', 'usergroups:read', 'user:patch', 'user:post'])]
    #[Length(min: 1, max: 64, groups: ['user:patchValidation', 'ownuser:patchValidation', 'user:postValidation'])]
    #[ORM\Column(length: 180, unique: true)]
    private ?string $username = null;

    /** @var Role[] */
    #[ORM\Column(name: 'roles', type: 'json', enumType: Role::class)]
    private array $rolesInternal = [];

    #[ORM\Column]
    private ?string $password = null;

    #[Groups(['ownuser:patch', 'user:post'])]
    #[Length(min: 6, groups: ['ownuser:patchValidation', 'user:postValidation', 'user:postValidation'])]
    private ?string $plainPassword = null;

    #[Ignore]
    #[ORM\ManyToMany(targetEntity: UserGroup::class, mappedBy: 'users')]
    private Collection $userGroups;

    #[Groups(['user:read', 'ownuser:patch', 'user:patch'])]
    #[Email]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[Groups(['user:read', 'user:patch'])]
    #[ORM\Column]
    private ?bool $active = null;

    #[Groups(['user:read', 'ownuser:patch'])]
    #[ORM\ManyToMany(targetEntity: Recipe::class)]
    private Collection $recipeFavorites;

    public function __construct() {
        $this->userGroups = new ArrayCollection();
        $this->recipeFavorites = new ArrayCollection();
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function getUsername(): ?string {
        return $this->username;
    }

    public function setUsername(string $username): self {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    #[Ignore]
    public function getUserIdentifier(): string {
        return (string) $this->username;
    }

    /** @return Role[] */
    #[Groups(['users:read', 'user:read', 'user:patch'])]
    #[AtLeastOneActiveAdmin(groups: ['user:patchValidation'])]
    #[HasUserRole(groups: ['user:patchValidation'])]
    #[SerializedName('roles')]
    public function getEnumRoles(): array {
        return $this->rolesInternal;
    }

    /**
     * @note The return type needs to be string[] due to the contract of UserInterface.
     * @return string[]
     * @see UserInterface
     * @deprecated Use getEnumRoles instead.
     */
    public function getRoles(): array {
        return Role::mapToStrings($this->rolesInternal);
    }

    /**
     * @param Role[]|string[] $roles
     * @return $this
     */
    #[Groups(['users:read', 'user:read', 'user:patch'])]
    #[SerializedName('roles')]
    public function setRoles(array $roles): self {
        $enumRoles = (count($roles) > 0 && is_string($roles[0])) ? Role::mapToRoles($roles) : $roles;
        $this->rolesInternal = $enumRoles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string {
        return $this->password;
    }

    public function setPassword(string $password): self {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void {
        $this->plainPassword = null;
    }

    /**
     * @return Collection<int, UserGroup>
     */
    public function getUserGroups(): Collection {
        return $this->userGroups;
    }

    public function addUserGroup(UserGroup $userGroup): self {
        if (!$this->userGroups->contains($userGroup)) {
            $this->userGroups->add($userGroup);
            $userGroup->addUser($this);
        }

        return $this;
    }

    public function removeUserGroup(UserGroup $userGroup): self {
        if ($this->userGroups->removeElement($userGroup)) {
            $userGroup->removeUser($this);
        }

        return $this;
    }

    public function getEmail(): ?string {
        return $this->email;
    }

    public function setEmail(?string $email): static {
        $this->email = $email;

        return $this;
    }

    public function isActive(): ?bool {
        return $this->active;
    }

    public function setActive(bool $active): static {
        $this->active = $active;

        return $this;
    }

    /**
     * @return Collection<int, Recipe>
     */
    public function getRecipeFavorites(): Collection {
        return $this->recipeFavorites;
    }

    public function addRecipeFavorite(Recipe $recipeFavorite): static {
        if (!$this->recipeFavorites->contains($recipeFavorite)) {
            $this->recipeFavorites->add($recipeFavorite);
        }

        return $this;
    }

    public function removeRecipeFavorite(Recipe $recipeFavorite): static {
        $this->recipeFavorites->removeElement($recipeFavorite);

        return $this;
    }
}
