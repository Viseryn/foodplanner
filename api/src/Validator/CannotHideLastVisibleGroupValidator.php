<?php

namespace App\Validator;

use App\Entity\UserGroup;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

final class CannotHideLastVisibleGroupValidator extends ConstraintValidator {

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {}

    public function validate(mixed $value, Constraint $constraint): void {
        $userGroup = $this->context->getRoot();

        if (!$constraint instanceof CannotHideLastVisibleGroup
            || !$userGroup instanceof UserGroup
            || !is_bool($value)) {
            throw new UnexpectedTypeException($constraint, CannotHideLastVisibleGroup::class);
        }

        $visibleUserGroups = $this->entityManager->getRepository(UserGroup::class)->findBy(['hidden' => false]);

        if ($value && count($visibleUserGroups) == 1) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}
