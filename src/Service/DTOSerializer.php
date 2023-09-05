<?php namespace App\Service;

use App\Component\Response\PrettyJsonResponse;
use App\DataTransferObject\DataTransferObject;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\Response;

final class DTOSerializer
{
    /**
     * Returns a PrettyJsonResponse of the serialized DTO data.
     * @param DataTransferObject|Collection<DataTransferObject> $dto
     * @return Response
     */
    public static function getResponse(DataTransferObject|Collection $dto): Response
    {
        return new PrettyJsonResponse(self::serialize($dto));
    }

    /**
     * Serializes a DataTransferObject or a Collection<DataTransferObject> into an associative array.
     * @param DataTransferObject|Collection<DataTransferObject> $dto
     * @return array
     */
    public static function serialize(DataTransferObject|Collection $dto): array
    {
        if ($dto instanceof Collection) {
            return $dto
                ->map(fn (DataTransferObject $dto) => self::dataTransferObjectToArray($dto))
                ->toArray();
        }

        return self::dataTransferObjectToArray($dto);
    }

    /**
     * Given a DataTransferObject, creates an array with public properties of the DTO as 
     * keys and the return value of their getter method as value. If properties are DTOs
     * or Collections of DTOs themselves, they will be recursively transformed into arrays
     * as well, so that the resulting return value is a pure array whose fields are no objects.
     */
    private static function dataTransferObjectToArray(DataTransferObject $dto): array
    {
        $arr = self::getPublicPropertiesOfDtoAsAssociativeArray($dto);

        foreach ($arr as $key => $value) {
            if ($value instanceof DataTransferObject) {
                $arr[$key] = self::dataTransferObjectToArray($value);
            }

            if ($value instanceof Collection) {
                $arr[$key] = $arr[$key]
                    ->map(fn (DataTransferObject $dto) => self::dataTransferObjectToArray($dto))
                    ->toArray();
            }
        }

        return $arr;
    }

    private static function getPublicPropertiesOfDtoAsAssociativeArray(DataTransferObject $dto): array
    {
        $arr = [];

        foreach (get_class_methods($dto) as $method) {
            if (str_starts_with($method, 'get')) {
                $property = lcfirst(substr($method, 3));
                $arr[$property] = call_user_func(array($dto, $method));
            }
        }

        return $arr;
    }
}
