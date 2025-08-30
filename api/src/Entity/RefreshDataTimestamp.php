<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Provider\RefreshDataTimestampProvider;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: "/refresh_data_timestamp",
            provider: RefreshDataTimestampProvider::class,
        ),
    ],
)]
#[ORM\Entity]
class RefreshDataTimestamp {
    #[Ignore]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $timestamp = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getTimestamp(): ?int {
        return $this->timestamp;
    }

    public function setTimestamp(int $timestamp): self {
        $this->timestamp = $timestamp;

        return $this;
    }
}
