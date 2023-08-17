<?php namespace App\DataTransferObject;

use App\Entity\MealCategory;

class MealCategoryDTO implements DataTransferObjectWithOptionField
{
    private ?int $id;
    private ?string $name;
    private ?string $icon;
    private ?bool $standard;
    private ?FormOptionFieldDTO $option;

    public function __construct(MealCategory $mealCategory)
    {
        $this->id = $mealCategory->getId();
        $this->name = $mealCategory->getName();
        $this->icon = $mealCategory->getIcon();
        $this->standard = $mealCategory->isStandard();
        $this->option = new RadioOptionDTO(
            'mealCategory_' . $this->getName(),
            $this->getName(),
            $this->getIcon(),
            $this->getStandard(),
            $this->getId()
        );
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

    public function getStandard(): ?bool
    {
        return $this->standard;
    }

    public function getOption(): ?FormOptionFieldDTO
    {
        return $this->option;
    }
}
