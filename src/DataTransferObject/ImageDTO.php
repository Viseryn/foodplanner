<?php namespace App\DataTransferObject;

use App\Entity\Image;

/**
 * @implements DataTransferObject<Image>
 */
class ImageDTO implements DataTransferObject
{
    private ?int $id = null;
    private ?string $filename = null;
    private ?string $directory = null;
    private ?bool $public = null;
    private ?string $imageContents = null;
    private ?bool $removeImage = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(?string $filename): self
    {
        $this->filename = $filename;
        return $this;
    }

    public function getDirectory(): ?string
    {
        return $this->directory;
    }

    public function setDirectory(?string $directory): self
    {
        $this->directory = $directory;
        return $this;
    }

    public function getPublic(): ?bool
    {
        return $this->public;
    }

    public function setPublic(?bool $public): self
    {
        $this->public = $public;
        return $this;
    }

    public function getImageContents(): ?string
    {
        return $this->imageContents;
    }

    public function setImageContents(?string $imageContents): self
    {
        $this->imageContents = $imageContents;
        return $this;
    }

    public function getRemoveImage(): ?bool
    {
        return $this->removeImage;
    }

    public function setRemoveImage(?bool $removeImage): self
    {
        $this->removeImage = $removeImage;
        return $this;
    }
}
