<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ImageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [],
    security: 'is_granted("ROLE_ADMIN")',
)]
#[ORM\Entity(repositoryClass: ImageRepository::class)]
class Image {
    #[Groups(["recipe:read"])]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(["recipe:read", "recipe:image"])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $filename = null;

    #[Groups(["recipe:read", "recipe:image"])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $directory = null;

    #[Groups(["recipe:read", "recipe:image"])]
    #[ORM\Column]
    private ?bool $public = null;

    #[Groups(["recipe:image"])]
    private ?string $imageContents = null;

    public function getId(): ?int {
        return $this->id;
    }

    public function getFilename(): ?string {
        return $this->filename;
    }

    public function setFilename(string $filename): self {
        $this->filename = $filename;

        return $this;
    }

    public function getDirectory(): ?string {
        return $this->directory;
    }

    public function setDirectory(string $directory): self {
        $this->directory = $directory;

        return $this;
    }

    public function isPublic(): ?bool {
        return $this->public;
    }

    public function setPublic(bool $public): self {
        $this->public = $public;

        return $this;
    }

    public function getImageContents(): ?string {
        return $this->imageContents;
    }

    public function setImageContents(?string $imageContents): Image {
        $this->imageContents = $imageContents;
        return $this;
    }
}
