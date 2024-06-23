<?php namespace App\DataTransferObject;

use App\Entity\Meal;

/**
 * @implements DataTransferObject<Meal>
 */
final class AddMealRequestDto implements DataTransferObject {
    private ?int $day = null;
    private ?int $mealCategory = null;
    private ?int $userGroup = null;
    private ?int $recipe = null;

    public function getId(): int|null {
        return null;
    }

    public function setId(?int $id): self {
        return $this;
    }

    public function getMealCategory(): ?int {
        return $this->mealCategory;
    }

    public function setMealCategory(?int $mealCategory): self {
        $this->mealCategory = $mealCategory;
        return $this;
    }

    public function getDay(): ?int {
        return $this->day;
    }

    public function setDay(?int $day): self {
        $this->day = $day;
        return $this;
    }

    public function getUserGroup(): ?int {
        return $this->userGroup;
    }

    public function setUserGroup(?int $userGroup): self {
        $this->userGroup = $userGroup;
        return $this;
    }

    public function getRecipe(): ?int {
        return $this->recipe;
    }

    public function setRecipe(?int $recipe): self {
        $this->recipe = $recipe;
        return $this;
    }
}
