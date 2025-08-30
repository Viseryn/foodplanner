<?php

namespace App\Validator;

use App\Entity\Ingredient;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

final class HasStoragePositionValidator extends ConstraintValidator {
    public function validate(mixed $value, Constraint $constraint): void {
        $ingredient = $this->context->getRoot();

        if (!$constraint instanceof HasStoragePosition
            || !$ingredient instanceof Ingredient) {
            throw new UnexpectedTypeException($constraint, HasStoragePosition::class);
        }

        if ($ingredient->getStorage() != null && $ingredient->getPosition() == null) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}
