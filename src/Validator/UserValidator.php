<?php namespace App\Validator;

use App\Component\Exception\ValidationFailedException;
use App\DataTransferObject\UserDTO;
use App\Entity\Roles;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Exception\UnsupportedException;

class UserValidator implements Validator {
    public function __construct(
        private readonly UserRepository $userRepository,
    ) {}

    /**
     * @param UserDTO $dto
     * @return void
     * @throws ValidationFailedException
     */
    public function validateDto($dto): void {
        throw new UnsupportedException();
    }

    /**
     * @param User $entity
     * @return void
     * @throws ValidationFailedException
     */
    public function validateEntity($entity): void {
        $this->validateUsername($entity->getUsername());
        $this->validateEmail($entity->getEmail());
        $this->validateRoles($entity);
    }

    /**
     * @throws ValidationFailedException
     */
    private function validateUsername(string $username): void {
        if (strlen($username) < 1 || strlen($username) > 64) {
            throw new ValidationFailedException("Username must be between 1 and 64 characters.");
        }
    }

    /**
     * @throws ValidationFailedException
     */
    private function validateEmail(?string $email): void {
        if (strlen($email) > 0 && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new ValidationFailedException("Invalid email address.");
        }
    }

    /**
     * @throws ValidationFailedException
     */
    private function validateRoles(User $user): void {
        if (sizeof($user->getRoles()) > 1 && !$user->isActive()) {
            throw new ValidationFailedException("User is not active but has roles.");
        }

        if ((new ArrayCollection($this->userRepository->findAll()))
                ->filter(fn ($user) => in_array(Roles::ROLE_USER_ADMINISTRATION->value, $user->getRoles())
                    && in_array(Roles::ROLE_ADMIN->value, $user->getRoles())
                    && $user->isActive())
                ->count() == 0) {
            throw new ValidationFailedException(
                "There must be at least one active admin user with the role " . Roles::ROLE_USER_ADMINISTRATION->value . "."
            );
        }
    }
}