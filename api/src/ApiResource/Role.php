<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Provider\RolesProvider;

#[ApiResource]
#[GetCollection(
    provider: RolesProvider::class,
)]
readonly class Role {
    public function __construct(
        public string $value,
    ) {}
}
