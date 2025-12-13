<?php

namespace App\Validator;

use App\Entity\Meal;
use App\Entity\Recipe;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

final class IsSideDishValidator extends ConstraintValidator {
    public function validate(mixed $value, Constraint $constraint): void {
        $meal = $this->context->getRoot();

        if (!$constraint instanceof IsSideDish || !$meal instanceof Meal) {
            throw new UnexpectedTypeException($constraint, IsSideDish::class);
        }

        if (!$meal->getSideDishes()->forAll(fn (int $i, Recipe $sideDish) => $sideDish->isSideDish())) {
            $this->context->buildViolation($constraint->message)->addViolation();
        }
    }
}
