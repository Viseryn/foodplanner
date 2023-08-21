<?php namespace App\DataTransferObject;

use App\Entity\MealCategory;

class MealCategoryDTO implements DataTransferObject
{
    private ?int $id;
    private ?string $name;
    private ?string $icon;

    public function __construct(MealCategory $mealCategory)
    {
        $this->id = $mealCategory->getId();
        $this->name = $mealCategory->getName();
        $this->icon = $mealCategory->getIcon();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function getIcon(): ?string
    {
        return $this->icon;
    }
}
