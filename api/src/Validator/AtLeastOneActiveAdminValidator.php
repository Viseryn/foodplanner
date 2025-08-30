<?php

namespace App\Validator;

use App\Entity\Role;
use App\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

final class AtLeastOneActiveAdminValidator extends ConstraintValidator {

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {}

    public function validate(mixed $value, Constraint $constraint): void {
        if (!$constraint instanceof AtLeastOneActiveAdmin) {
            throw new UnexpectedTypeException($constraint, AtLeastOneActiveAdmin::class);
        }

        $otherActiveUsersWithUserAdminRole = (new ArrayCollection($this->entityManager->getRepository(User::class)->findAll()))
            ->filter(fn (User $user) => in_array(Role::USER_ADMINISTRATION, $user->getEnumRoles()))
            ->filter(fn (User $user) => in_array(Role::ADMIN, $user->getEnumRoles()))
            ->filter(fn (User $user) => $user->isActive())
            ->filter(fn (User $user) => $user->getId() != $this->context->getRoot()->getId());

        if ($otherActiveUsersWithUserAdminRole->count() == 0
            && (!$this->context->getRoot()->isActive()
                || !in_array(Role::USER_ADMINISTRATION, $value)
                || !in_array(Role::ADMIN, $value))) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}