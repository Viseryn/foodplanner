<?php namespace App\DataTransferObject;

use App\Entity\InstallationStatus;

/**
 * @implements DataTransferObject<InstallationStatus>
 */
class InstallationStatusDTO implements DataTransferObject
{
    private ?bool $status = null;
    private ?bool $update_v1_6 = null;
    private ?string $version = null;

    public function getId(): ?int
    {
        return 1;
    }

    public function setId(?int $id): self
    {
        return $this;
    }

    public function getStatus(): ?bool
    {
        return $this->status;
    }

    public function setStatus(?bool $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getUpdateV16(): ?bool
    {
        return $this->update_v1_6;
    }

    public function setUpdateV16(?bool $update_v1_6): self
    {
        $this->update_v1_6 = $update_v1_6;
        return $this;
    }

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(?string $version): self
    {
        $this->version = $version;
        return $this;
    }
}
