<?php namespace App\DataTransferObject;

use Doctrine\Common\Collections\ReadableCollection;

/**
 * @implements DataTransferObject<Day>
 */
class DayDTO implements DataTransferObject
{
    private ?int $id = null;
    private ?int $timestamp = null;
    private ?string $weekday = null;
    private ?string $date = null;
    /** @var ReadableCollection<MealDTO>|null */
    private ?ReadableCollection $meals = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getTimestamp(): ?int
    {
        return $this->timestamp;
    }

    public function setTimestamp(?int $timestamp): self
    {
        $this->timestamp = $timestamp;
        return $this;
    }

    public function getWeekday(): ?string
    {
        return $this->weekday;
    }

    public function setWeekday(?string $weekday): self
    {
        $this->weekday = $weekday;
        return $this;
    }

    public function getDate(): ?string
    {
        return $this->date;
    }

    public function setDate(?string $date): self
    {
        $this->date = $date;
        return $this;
    }

    /** @return ReadableCollection<MealDTO>|null */
    public function getMeals(): ?ReadableCollection
    {
        return $this->meals;
    }

    /**
     * @param ReadableCollection<MealDTO>|null $meals
     * @return $this
     */
    public function setMeals(?ReadableCollection $meals): self
    {
        $this->meals = $meals;
        return $this;
    }
}
