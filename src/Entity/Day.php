<?php

namespace App\Entity;

use App\Repository\DayRepository;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DayRepository::class)]
class Day
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $timestamp = null;

    #[ORM\OneToMany(mappedBy: 'day', targetEntity: Meal::class, orphanRemoval: true)]
    private Collection $meals;

    public function __construct()
    {
        $this->meal = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTimestamp(): ?int
    {
        return $this->timestamp;
    }

    public function setTimestamp(int $timestamp): self
    {
        $this->timestamp = $timestamp;

        return $this;
    }

    /**
     * @return Collection<int, Meal>
     */
    public function getMeals(): Collection
    {
        return $this->meals;
    }

    public function addMeal(Meal $meal): self
    {
        if (!$this->meals->contains($meal)) {
            $this->meals->add($meal);
            $meal->setDay($this);
        }

        return $this;
    }

    public function removeMeal(Meal $meal): self
    {
        if ($this->meals->removeElement($meal)) {
            // set the owning side to null (unless already changed)
            if ($meal->getDay() === $this) {
                $meal->setDay(null);
            }
        }

        return $this;
    }

    public function __toString()
    {
        return date('Y-m-d', $this->timestamp);
        // return $this->timestamp;
    }

    public function getWeekday()
    {
        $dt = new DateTime();
        $dt->setTimestamp($this->timestamp);
        return $dt->format('l');
    }
}
