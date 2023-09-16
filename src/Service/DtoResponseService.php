<?php namespace App\Service;

use App\Component\Response\PrettyJsonResponse;
use App\DataTransferObject\DataTransferObject;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\Response;

final class DtoResponseService
{
    /**
     * Given a DataTransferObject or a Collection<DataTransferObject>, serializes the argument and returns a
     * PrettyJsonResponse with the content.
     *
     * @param DataTransferObject|Collection $dto
     * @return Response
     */
    public static function getResponse(DataTransferObject|Collection $dto): Response {
        return new PrettyJsonResponse(DtoSerializer::serialize($dto));
    }
}
