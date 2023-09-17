<?php namespace App\Service;

use App\DataTransferObject\DataTransferObject;
use Doctrine\Common\Collections\Collection;

final class DtoSerializer
{
    /**
     * Serializes a DataTransferObject or a Collection<DataTransferObject> into an associative array.
     * For example, if the DTO has fields "foo" and "bar" with corresponding getters, then the returned array
     * will look like ["foo" => $dto->getFoo(), "bar" => $dto->getBar()]. If the argument is a collection, then
     * the returned array is an array of such arrays as above.
     *
     * @param DataTransferObject|Collection<DataTransferObject> $dto
     * @return array
     */
    public static function serialize(DataTransferObject|Collection $dto): array
    {
        if ($dto instanceof Collection) {
            return self::collectionOfDtosToArray($dto);
        }

        return self::dtoToArray($dto);
    }

    /**
     * @param Collection<DataTransferObject> $dto
     */
    private static function collectionOfDtosToArray(Collection $dto): array
    {
        // Use array_values so that the resulting array is zero-indexed
        return array_values(
            $dto->map(fn (DataTransferObject $dto) => self::dtoToArray($dto))
                ->toArray(),
        );
    }

    /**
     * Given a DataTransferObject, creates an array with public properties of the DTO as
     * keys and the return value of their getter method as value. If properties are DTOs
     * or Collections of DTOs themselves, they will be recursively transformed into arrays
     * as well, so that the resulting return value is a pure array whose fields are no objects.
     */
    private static function dtoToArray(DataTransferObject $dto): array
    {
        $arr = self::getPublicPropertiesOfDtoAsAssociativeArray($dto);
        self::convertNonPrimitivePropertiesToAssociativeArray($arr);
        return $arr;
    }

    private static function getPublicPropertiesOfDtoAsAssociativeArray(DataTransferObject $dto): array
    {
        $arr = [];

        foreach (get_class_methods($dto) as $method) {
            if (str_starts_with($method, 'get')) {
                $property = lcfirst(substr($method, 3));
                $arr[$property] = call_user_func([$dto, $method]);
            }
        }

        return $arr;
    }

    private static function convertNonPrimitivePropertiesToAssociativeArray(array &$arr): void
    {
        foreach ($arr as $key => $value) {
            if ($value instanceof DataTransferObject) {
                $arr[$key] = self::dtoToArray($value);
            }

            if ($value instanceof Collection) {
                $arr[$key] = self::collectionOfDtosToArray($value);
            }
        }
    }
}
