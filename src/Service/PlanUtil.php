<?php

namespace App\Service;

class PlanUtil
{
    /**
     * Returns the timestamp of the given date.
     *
     * @param string $date
     * @return integer
     */
    public function dateToTimestamp(string $date): int
    {
        return strtotime($date);
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
}