<?php namespace App\DataTransferObject;

use App\Entity\Settings;

class SettingsDTO implements DataTransferObject
{
    private ?int $id;
    private ?UserDTO $user;
    private ?bool $showPantry;
    private ?UserGroupDTO $standardUserGroup;
    private ?MealCategoryDTO $standardMealCategory;

    public function __construct(Settings $settings)
    {
        $this->id = $settings->getId();
        $this->user = new UserDTO($settings->getUser());
        $this->showPantry = $settings->isShowPantry();
        $this->standardUserGroup = $settings->getStandardUserGroup() !== null
            ? new UserGroupDTO($settings->getStandardUserGroup())
            : null;
        $this->standardMealCategory = $settings->getStandardMealCategory() !== null
            ? new MealCategoryDTO($settings->getStandardMealCategory())
            : null;
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

    public function getStandardUserGroup(): ?UserGroupDTO
    {
        return $this->standardUserGroup;
    }

    public function getStandardMealCategory(): ?MealCategoryDTO
    {
        return $this->standardMealCategory;
    }
}
