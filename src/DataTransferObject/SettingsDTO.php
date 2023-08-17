<?php namespace App\DataTransferObject;

use App\Entity\Settings;

class SettingsDTO implements DataTransferObject
{
    private ?int $id;
    private ?UserDTO $user;
    private ?bool $showPantry;

    public function __construct(Settings $settings)
    {
        $this->id = $settings->getId();
        $this->user = new UserDTO($settings->getUser());
        $this->showPantry = $settings->isShowPantry();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?UserDTO
    {
        return $this->user;
    }

    public function getShowPantry(): ?bool
    {
        return $this->showPantry;
    }
}
