<?php namespace App\Service;

final class ClassnameMapperService
{
    /**
     * @param string $entityClass
     * @param bool $full [Default: false] If true, the full class name, including namespace, will be returned. If false,
     *     only the pure class name will be returned.
     * @return string
     */
    public static function mapperForEntity(string $entityClass, bool $full = false): string
    {
        return self::getClassname($full ? '\App\Mapper\\' : '', $entityClass, 'Mapper');
    }

    /**
     * @param string $entityClass
     * @param bool $full [Default: false] If true, the full class name, including namespace, will be returned. If false,
     *     only the pure class name will be returned.
     * @return string
     */
    public static function dtoForEntity(string $entityClass, bool $full = false): string
    {
        return self::getClassname($full ? '\App\DataTransferObject\\' : '', $entityClass, 'DTO');
    }

    private static function getClassname(string $prefix, string $entityClass, string $suffix): string
    {
        return $prefix . self::getPureClassnameOf($entityClass) . $suffix;
    }

    private static function getPureClassnameOf(string $class): string
    {
        $explodeClass = explode('\\', $class);
        return end($explodeClass);
    }
}