<?php namespace App\Service;

use App\DataTransferObject\DayDTO;
use App\Entity\Day;
use App\Repository\DayRepository;
use Doctrine\Common\Collections\ArrayCollection;

final class DayControllerService
{
    private int $today;

    public function __construct(
        private DayRepository $dayRepository,
        /** @var int[] */ private array $newDaysTimestamps = [],
    ) {
        $this->today = (int) strtotime('today');
    }

    /** @return ArrayCollection<DayDTO> */
    public function getAllDays(): ArrayCollection
    {
        return (new ArrayCollection($this->dayRepository->findBy([], ['timestamp' => 'ASC'])))
            ->map(fn ($day) => new DayDTO($day));
    }

    /**
     * Deletes all past Day objects and creates new Day objects up to ten days in the future.
     */
    public function updateDays(): void
    {
        $days = $this->dayRepository->findBy([], ['timestamp' => 'ASC']);

        $this
            ->deletePastDays($days)
            ->createNewDayIfNoneSurvived()
            ->fillUpDaysToTen()
            ->deleteEverythingAfterTenDaysInTheFuture();
    }

    /** @param Day[] $days */
    private function deletePastDays(array $days): self
    {
        foreach ($days as $day) {
            if ($day->getTimestamp() < $this->today) {
                $this->dayRepository->remove($day, true);
            } else {
                $this->newDaysTimestamps[] = $day->getTimestamp();
            }
        }

        return $this;
    }

    private function createNewDayIfNoneSurvived(): self
    {
        if (count($this->newDaysTimestamps) === 0) {
            $day = (new Day)->setTimestamp($this->today);
            $this->dayRepository->add($day, true);
            $this->newDaysTimestamps[] = $day->getTimestamp();
        }

        return $this;
    }

    private function fillUpDaysToTen(): self
    {
        if (count($this->newDaysTimestamps) < 10) {
            while (count($this->newDaysTimestamps) < 10) {
                $day = (new Day)->setTimestamp(
                    strtotime('+1 day', end($this->newDaysTimestamps))
                );
                $this->dayRepository->add($day, true);
                $this->newDaysTimestamps[] = $day->getTimestamp();
            }
        }

        return $this;
    }

    private function deleteEverythingAfterTenDaysInTheFuture(): void
    {
        if (count($this->newDaysTimestamps) > 10) {
            $currentDays = $this->dayRepository->findBy([], ['timestamp' => 'ASC']);

            for ($i = count($this->newDaysTimestamps) - 1; count($this->newDaysTimestamps) > 10; $i--) {
                $this->dayRepository->remove($currentDays[$i], true);
                array_pop($this->newDaysTimestamps);
            }
        }
    }
}