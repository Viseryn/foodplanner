<?php namespace App\Service;

use App\Entity\EntityModel;
use App\Entity\Day;
use App\Repository\DayRepository;
use DateTime;

/**
 * DayUtil
 */
class DayUtil extends EntityUtil
{
    private DayRepository $dayRepository;
    private MealUtil $mealUtil;

    public function __construct(DayRepository $dayRepository, MealUtil $mealUtil) 
    {
        $this->dayRepository = $dayRepository;
        $this->mealUtil = $mealUtil;
    }

    /**
     * Deletes all past Day objects and creates new Day objects up to ten days in the future.
     */
    public function updateDays(): void
    {
        // Fetch current days
        $currentDays = $this->dayRepository->findBy([], ['timestamp' => 'ASC']);
        $today = strtotime('today');

        $newDays = [];

        foreach ($currentDays as $day) {
            if ($day->getTimestamp() < $today) {
                // Delete all Day objects before today
                $this->dayRepository->remove($day, true);
            } else {
                // Save timestamps of all currently existing Day objects
                $newDays[] = $day->getTimestamp();
            }
        }

        // Create a single Day object if $newDays is empty
        if (count($newDays) === 0) {
            $day = (new Day())->setTimestamp($today);

            $this->dayRepository->add($day, true);
            $newDays[] = $day->getTimestamp();
        }

        // Create new Day objects if there are now less than ten Day objects
        if (count($newDays) < 10) {
            while (count($newDays) < 10) {
                $day = (new Day())->setTimestamp(strtotime('+1 day', end($newDays)));

                $this->dayRepository->add($day, true);
                $newDays[] = $day->getTimestamp();
            }
        }

        // Delete everything after ten days in the future
        if (count($newDays) > 10) {
            $currentDays = $this->dayRepository->findBy([], ['timestamp' => 'ASC']);

            for ($i = count($newDays) - 1; count($newDays) > 10; $i--) {
                $this->dayRepository->remove($currentDays[$i], true);

                array_pop($newDays);
            }
        }
    }

    /** @param Day $day */
    public function getApiModel(EntityModel $day): array
    {
        return [
            'id' => $day->getId(),
            'timestamp' => $day->getTimestamp(),
            'weekday' => $this->getWeekday($day),
            'date' => $this->getDate($day),
            'meals' => $this->mealUtil->getApiModels($day->getMeals()),
            'option' => [
                'id' => $day->getId(),
                'label' => $this->getDate($day) . ', ' . $this->getWeekday($day),
            ],
        ]; 
    }

    /**
     * @param Day $day
     * @return string Returns the (German) weekday of the Day object.
     */
    private function getWeekday(Day $day): string
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
        $dt->setTimestamp($day->getTimestamp());
        $wd = $dt->format('l');

        return $weekdays[$wd];
    }

    /**
     * @param Day $day
     * @return string Returns the date of the Day object in the format 'dd.mm.yyyy'.
     */
    private function getDate(Day $day): string
    {
        return date('d.m.Y', $day->getTimestamp());
    }
}
