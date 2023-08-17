<?php namespace App\DataTransferObject;

use App\Entity\Day;
use DateTime;
use Doctrine\Common\Collections\Collection;

class DayDTO implements DataTransferObjectWithOptionField
{
    private ?int $id;
    private ?int $timestamp;
    private ?string $weekday;
    private ?string $date;
    /** @var Collection<MealDTO> */
    private Collection $meals;
    private ?FormOptionFieldDTO $option;

    public function __construct(Day $day)
    {
        $this->id = $day->getId();
        $this->timestamp = $day->getTimestamp();
        $this->weekday = $this->calculateWeekday();
        $this->date = date('d.m.Y', $this->getTimestamp());
        $this->meals = $day->getMeals()->map(fn ($meal) => new MealDTO($meal));
        $this->option = new SelectOptionDTO($this->getId(), $this->getDate() . ', ' . $this->getWeekday());
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTimestamp(): ?int
    {
        return $this->timestamp;
    }

    private function calculateWeekday(): ?string
    {
        $weekdays = [
            'Monday' => 'Montag',
            'Tuesday' => 'Dienstag',
            'Wednesday' => 'Mittwoch',
            'Thursday' => 'Donnerstag',
            'Friday' => 'Freitag',
            'Saturday' => 'Samstag',
            'Sunday' => 'Sonntag'
        ];

        $dt = new DateTime();
        $dt->setTimestamp($this->getTimestamp());
        $wd = $dt->format('l');

        return $weekdays[$wd];
    }

    public function getWeekday(): ?string
    {
        return $this->weekday;
    }

    public function getDate(): ?string
    {
        return $this->date;
    }

    /** @return Collection<MealDTO> */
    public function getMeals(): Collection
    {
        return $this->meals;
    }

    public function getOption(): ?FormOptionFieldDTO
    {
        return $this->option;
    }
}
