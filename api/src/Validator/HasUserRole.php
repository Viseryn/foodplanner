<?php

namespace App\Validator;

use App\Entity\Role;
use Symfony\Component\Validator\Constraint;

#[\Attribute]
final class HasUserRole extends Constraint {

    public string $message = "The role " . Role::USER->value . " cannot be removed from a user.";
    public string $mode = "strict";

    public function __construct(?string $mode = null, ?string $message = null, ?array $groups = null, $payload = null)
    {
        parent::__construct([], $groups, $payload);

        $this->mode = $mode ?? $this->mode;
        $this->message = $message ?? $this->message;
    }
}
