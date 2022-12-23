<?php

namespace App\Entity;

use App\Repository\SettingsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SettingsRepository::class)]
class Settings
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $showPantry = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isShowPantry(): ?bool
    {
        return $this->showPantry;
    }

    public function setShowPantry(bool $showPantry): self
    {
        $this->showPantry = $showPantry;

        return $this;
    }
}
