<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Provider\InstallationStatusProvider;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Ignore;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: "/installation_status",
            provider: InstallationStatusProvider::class,
        ),
    ]
)]
#[ORM\Entity]
class InstallationStatus {
    #[Ignore]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $status = null;

    #[ORM\Column(length: 64)]
    private ?string $apiVersion = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function isStatus(): ?bool {
        return $this->status;
    }

    public function setStatus(bool $status): static {
        $this->status = $status;

        return $this;
    }

    public function getApiVersion(): ?string {
        return $this->apiVersion;
    }

    public function setApiVersion(string $apiVersion): static {
        $this->apiVersion = $apiVersion;

        return $this;
    }
}
