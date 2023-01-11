<?php

namespace App\Service;

use App\Repository\RefreshDataTimestampRepository;

class RefreshDataTimestampUtil 
{
    /**
     * @var RefreshDataTimestampRepository
     */
    private RefreshDataTimestampRepository $repository;

    /**
     * @param RefreshDataTimestampRepository $refreshDataTimestampRepository
     */
    public function __construct(
        RefreshDataTimestampRepository $refreshDataTimestampRepository,
    ) {
        $this->repository = $refreshDataTimestampRepository;
    }

    /**
     * Updates the timestamp of the RefreshDataTimestamp object
     * to the current timestamp (integer).
     *
     * @return self
     */
    public function updateTimestamp(): self 
    {
        $timestamp = $this->repository->find(1);
        $timestamp->setTimestamp(time());

        $this->repository?->save($timestamp, true);

        return $this;
    }
}
