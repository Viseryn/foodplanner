<?php

namespace App\Entity;

use App\Repository\InstallationStatusRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InstallationStatusRepository::class)]
class InstallationStatus
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $status = null;

    #[ORM\Column(nullable: true)]
    private ?bool $update_v1_6 = null;

    #[ORM\Column(length: 64)]
    private ?string $version = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isStatus(): ?bool
    {
        return $this->status;
    }

    public function setStatus(bool $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function isUpdateV16(): ?bool
    {
        return $this->update_v1_6;
    }

    public function setUpdateV16(?bool $update_v1_6): static
    {
        $this->update_v1_6 = $update_v1_6;

        return $this;
    }

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(string $version): static
    {
        $this->version = $version;

        return $this;
    }
}
