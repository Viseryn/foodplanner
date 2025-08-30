<?php

namespace App\Validator;

use App\Entity\Settings;
use App\Entity\UserGroup;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

final class CannotHideSomeonesStandardGroupValidator extends ConstraintValidator {

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {}

    public function validate(mixed $value, Constraint $constraint): void {
        $userGroup = $this->context->getRoot();

        if (!$constraint instanceof CannotHideSomeonesStandardGroup
            || !$userGroup instanceof UserGroup
            || !is_bool($value)) {
            throw new UnexpectedTypeException($constraint, CannotHideSomeonesStandardGroup::class);
        }

        $standardUserGroups = array_map(
            fn (Settings $settings): ?UserGroup => $settings->getStandardUserGroup(),
            $this->entityManager->getRepository(Settings::class)->findAll(),
        );

        if ($value && in_array($userGroup, $standardUserGroups)) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}
