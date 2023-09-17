<?php namespace App\Service;

use App\DataTransferObject\DataTransferObject;
use App\Entity\EntityInterface;
use App\Mapper\MapperFactory;
use Doctrine\Common\Collections\ArrayCollection;
use InvalidArgumentException;

final class JsonDeserializer
{
    /**
     * Decodes a given JSON string representing a list of DTOs, converts it to `DataTransferObject<E>` and then
     * returns an ArrayCollection of entities by using the appropriate `Mapper<E>` class.
     *
     * @template E of EntityInterface
     * @param string $json
     * @param class-string<E> $entityClass
     * @return ArrayCollection<E>
     */
    public static function jsonArrayToEntities(string $json, string $entityClass)
    {
        $entities = new ArrayCollection;
        $data = json_decode($json);

        if (array_is_list($data)) {
            foreach ($data as $entityModel) {
                $entities->add(
                    self::jsonToEntity(json_encode($entityModel), $entityClass),
                );
            }
        }

        return $entities;
    }

    /**
     * Decodes a given JSON string representing a DTO, converts it to a `DataTransferObject<E>` and then
     * returns an entity by using the appropriate `Mapper<E>` class.
     *
     * @template E of EntityInterface
     * @param string $json
     * @param class-string<E> $entityClass
     * @return E
     */
    public static function jsonToEntity(string $json, string $entityClass)
    {
        $mapper = MapperFactory::getMapperFor($entityClass);
        $dtoClass = ClassnameMapperService::dtoForEntity($entityClass, true);

        return $mapper->dtoToEntity(
            self::jsonToDto($json, $dtoClass),
        );
    }

    /**
     * Decodes a given JSON string representing a DTO and converts it to a `DataTransferObject<E>`.
     * This method ignores properties that are not properties of the DTO class and it also **does not**
     * set the id field.
     *
     * @template E of EntityInterface
     * @param string $json
     * @param class-string<DataTransferObject<E>> $dtoClass
     * @return DataTransferObject<E>
     */
    public static function jsonToDto(string $json, string $dtoClass): DataTransferObject
    {
        $dto = new $dtoClass;
        $data = json_decode($json, true);

        foreach ($data as $property => $value) {
            if ($property === 'id') {
                continue;
            }

            if (!self::dtoHasProperty($dtoClass, $property)) {
                throw new InvalidArgumentException('Given DTO class does not have property "' . $property . '".');
            }

            self::convertValueToCorrectType($property, $value);
            self::setDtoProperty($dto, $property, $value);
        }

        return $dto;
    }

    /**
     * Returns true if the given DTO class has a defined getter and setter method for the given property.
     *
     * @template E of EntityInterface
     * @param class-string<DataTransferObject<E>> $dtoClass
     * @param string $property
     * @return bool
     */
    private static function dtoHasProperty(string $dtoClass, string $property): bool
    {
        $getterMethod = "get" . ucfirst($property);
        $setterMethod = "set" . ucfirst($property);

        return in_array($getterMethod, get_class_methods($dtoClass))
            && in_array($setterMethod, get_class_methods($dtoClass));
    }

    private static function convertValueToCorrectType(string $property, mixed &$value): void
    {
        if (!is_array($value)) {
            return;
        }

        // If $value is a list (i.e., not an associative array), we can either let it be as is (for example, if
        // it is a list of strings) or convert it to a Collection of DTOs of the right type.
        // Otherwise, $value is an associative array and we try to convert it to a DTO of the right type.
        if (array_is_list($value)) {
            if (self::isValuePrimitive($value)) {
                return;
            }
            self::convertValueToCollectionOfDtos($property, $value);
        } else {
            self::convertValueToDto($property, $value);
        }
    }

    /**
     * Returns true if the given array is not empty and either a scalar (int, bool, string)
     * or a list array, i.e. not associative.
     */
    private static function isValuePrimitive(array $value): bool
    {
        return !empty($value) && (is_scalar($value[0]) || array_is_list($value[0]));
    }

    private static function convertValueToCollectionOfDtos(string $property, array &$value): void
    {
        // Cut of last letter and check if the property is plural of some entity
        $propertyWithoutLastLetter = substr($property, 0, -1);
        if (!self::existsDtoClassOf($propertyWithoutLastLetter)) {
            throw new InvalidArgumentException(
                sprintf('There is no matching DTO class for property "%s".', $propertyWithoutLastLetter),
            );
        }

        // Convert $value to an ArrayCollection of DTOs.
        $collectionOfDtos = new ArrayCollection;
        foreach ($value as $val) {
            $collectionOfDtos->add(
                self::jsonToDto(json_encode($val), self::dtoClassOf($propertyWithoutLastLetter)),
            );
        }
        $value = $collectionOfDtos;
    }

    private static function convertValueToDto(string $property, array &$value): void
    {
        if (!self::existsDtoClassOf($property)) {
            throw new InvalidArgumentException(
                sprintf('There is no matching DTO class for property "%s".', $property),
            );
        }

        $value = self::jsonToDto(json_encode($value), self::dtoClassOf($property));
    }

    private static function existsDtoClassOf(string $class): bool
    {
        $dtoClassCandidate = self::dtoClassOf($class);
        return class_exists($dtoClassCandidate);
    }

    private static function dtoClassOf(string $class): string
    {
        $entityClassCandidate = ucfirst($class);
        return ClassnameMapperService::dtoForEntity($entityClassCandidate, true);
    }

    /**
     * @template E of EntityInterface
     * @param DataTransferObject<E> $dto
     * @param string $property
     * @param mixed $value
     * @return void
     */
    private static function setDtoProperty(DataTransferObject $dto, string $property, mixed $value): void
    {
        call_user_func([$dto, "set" . ucfirst($property)], $value);
    }
}
