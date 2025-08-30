<?php

namespace App\Validator;

use App\Entity\Ingredient;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

final class StorageXorRecipeValidator extends ConstraintValidator {
    public function validate(mixed $value, Constraint $constraint): void {
        $ingredient = $this->context->getRoot();

        if (!$constraint instanceof StorageXorRecipe
            || !$ingredient instanceof Ingredient) {
            throw new UnexpectedTypeException($constraint, StorageXorRecipe::class);
        }

        if ($ingredient->getRecipe() != null && $ingredient->getStorage() !== null) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}
