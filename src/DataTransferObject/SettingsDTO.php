<?php namespace App\DataTransferObject;

/**
 * @implements DataTransferObject<Settings>
 */
class SettingsDTO implements DataTransferObject
{
    private ?int $id = null;
    private ?UserDTO $user = null;
    private ?bool $showPantry = null;
    private ?UserGroupDTO $standardUserGroup = null;
    private ?MealCategoryDTO $standardMealCategory = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getUser(): ?UserDTO
    {
        return $this->user;
    }

    public function setUser(?UserDTO $user): self
    {
        $this->user = $user;
        return $this;
    }


    public function getShowPantry(): ?bool
    {
        return $this->showPantry;
    }

    public function setShowPantry(?bool $showPantry): self
    {
        $this->showPantry = $showPantry;
        return $this;
    }

    public function getStandardUserGroup(): ?UserGroupDTO
    {
        return $this->standardUserGroup;
    }

    public function setStandardUserGroup(?UserGroupDTO $standardUserGroup): self
    {
        $this->standardUserGroup = $standardUserGroup;
        return $this;
    }

    public function getStandardMealCategory(): ?MealCategoryDTO
    {
        return $this->standardMealCategory;
    }

    public function setStandardMealCategory(?MealCategoryDTO $standardMealCategory): self
    {
        $this->standardMealCategory = $standardMealCategory;
        return $this;
    }
}
