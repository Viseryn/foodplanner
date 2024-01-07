<?php namespace App\Service;

use App\DataTransferObject\DayDTO;
use App\Entity\Day;
use App\Mapper\Mapper;
use App\Mapper\MapperFactory;
use App\Repository\DayRepository;
use Doctrine\Common\Collections\ArrayCollection;

final class DayControllerService
{
    /** @var Mapper<Day> */
    private Mapper $mapper;
    /** @var int[] */
    private array $newDaysTimestamps = [];
    private int $today;

    public function __construct(
        private readonly DayRepository $dayRepository,
        private readonly MapperFactory $mapperFactory,
    ) {
        $this->today = (int) strtotime('today');
        $this->mapper = $this->mapperFactory::getMapperFor(Day::class);
    }

    /** @return ArrayCollection<DayDTO> */
    public function getAllDays(): ArrayCollection
    {
        return (new ArrayCollection($this->dayRepository->findBy([], ['timestamp' => 'ASC'])))
            ->map(fn ($day) => $this->mapper->entityToDto($day));
    }

    /**
     * Deletes all past Day objects and creates new Day objects up to ten days in the future.
     *
     * @return bool Returns true if the Day objects have actually changed and false otherwise.
     */
    public function updateDays(): bool
    {
        $days = $this->dayRepository->findBy([], ['timestamp' => 'ASC']);
        $daysCopy = $days;

        $this
            ->deletePastDays($days)
            ->createNewDayIfNoneSurvived()
            ->fillUpDaysToTen()
            ->deleteEverythingAfterTenDaysInTheFuture();

        $days = $this->dayRepository->findBy([], ['timestamp' => 'ASC']);

        return !($days === $daysCopy);
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
                    strtotime('+1 day', end($this->newDaysTimestamps)),
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
