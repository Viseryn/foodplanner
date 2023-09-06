<?php namespace App\Mapper;

use App\DataTransferObject\DayDTO;
use App\Entity\Day;
use DateTime;

/**
 * @implements Mapper<Day>
 */
final class DayMapper implements Mapper
{

    public function __construct(
        private readonly MealMapper $mealMapper,
    ) {}

    /**
     * @param DayDTO $dto
     * @return Day
     */
    public function dtoToEntity($dto): Day
    {
        $day = (new Day)->setTimestamp($dto->getTimestamp());

        $meals = $dto->getMeals()->map(fn ($mealDto) => $this->mealMapper->dtoToEntity($mealDto));
        foreach ($meals as $meal) {
            $day->addMeal($meal);
        }

        return $day;
    }

    /**
     * @param Day $entity
     * @return DayDTO
     */
    public function entityToDto($entity): DayDTO
    {
        return (new DayDTO)->setId($entity->getId())
            ->setTimestamp($entity->getTimestamp())
            ->setDate(date('d.m.Y', $entity->getTimestamp()))
            ->setWeekday($this->calculateWeekday($entity->getTimestamp()))
            ->setMeals($entity->getMeals()->map(fn ($meal) => $this->mealMapper->entityToDto($meal)));
    }

    private function calculateWeekday(?int $timestamp): ?string
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
        $dt->setTimestamp($timestamp);
        $wd = $dt->format('l');

        return $weekdays[$wd];
    }
}
