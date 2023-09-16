<?php namespace App\Service;

use App\Component\Response\PrettyJsonResponse;
use App\DataTransferObject\DataTransferObject;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\Response;

final class DtoResponseService
{
    /**
     * Returns a PrettyJsonResponse of the serialized DTO data.
     *
     * @param DataTransferObject|Collection $dto
     * @return Response
     */
    public static function getResponse(DataTransferObject|Collection $dto): Response {
        return new PrettyJsonResponse(DtoSerializer::serialize($dto));
    }
}
