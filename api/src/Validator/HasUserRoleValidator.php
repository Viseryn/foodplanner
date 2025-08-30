<?php

namespace App\Validator;

use App\Entity\Role;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

final class HasUserRoleValidator extends ConstraintValidator {

    public function validate(mixed $value, Constraint $constraint): void {
        if (!$constraint instanceof HasUserRole) {
            throw new UnexpectedTypeException($constraint, HasUserRole::class);
        }

        if (!in_array(Role::USER, $value)) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}