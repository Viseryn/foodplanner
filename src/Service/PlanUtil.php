<?php

namespace App\Service;

use App\Entity\Day;

class PlanUtil
{
    /**
     * Returns the timestamp of the given date.
     *
     * @param string|Day $date
     * @return integer
     */
    public function dateToTimestamp(string|Day $date): int
    {
        return strtotime((string) $date);
    }

    /**
     * Returns the date in the format YYYY-mm-dd for a given timestamp.
     *
     * @param integer $timestamp
     * @return string
     */
    public function timestampToDate(int $timestamp): string 
    {
        return date('Y-m-d', $timestamp);
    }
    
    /**
     * Returns the timestamp of the beginning of the week.
     *
     * @return integer
     */
    public function currentWeekStart(): int
    {
        return (date('D') != 'Mon') 
            ? $this->dateToTimestamp('last Monday')
            : $this->dateToTimestamp('today');
    }
    
    /**
     * Returns the timestamp of the end of the week.
     *
     * @return integer
     */
    public function currentWeekEnd(): int
    {
        return (date('D') != 'Sun') 
            ? $this->dateToTimestamp('next Sunday')
            : $this->dateToTimestamp('today');
    }

    /**
     * Returns an array of seven Day objects for the current week.
     *
     * @return Day[]
     */
    public function currentWeek(): array
    {
        $week = [];
        $start = $this->currentWeekStart();

        for ($i = 0; $i < 7; $i++) {
            $week[$i] = (new Day())->setTimestamp($start + 86400 * $i);
        }

        return $week;
    }

    /**
     * Returns an array of seven Day objects for the next week.
     *
     * @return Day[]
     */
    public function nextWeek(): array
    {
        $week = [];
        $start = $this->currentWeekEnd();

        for ($i = 1; $i < 8; $i++) {
            $week[$i] = (new Day())->setTimestamp($start + 86400 * $i);
        }

        return $week;
    }
}