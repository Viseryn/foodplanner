<?php namespace App\Mapper;

final class MapperFactory
{
    public function __construct()
    {
    }

    /**
     * Given a class that implements EntityInterface, returns a corresponding Mapper class.
     * If the Mapper class' constructor needs other Mapper classes injected, a concrete Mapper object
     * is constructed in a private static method that creates and injects all necessary classes.
     *
     * ``public static function <E> getMapperFor(Class<E> entityClass): Mapper<E>``
     *
     * @param string $entityClass
     * @return Mapper
     */
    public static function getMapperFor(string $entityClass): Mapper
    {
        $instance = new self();
        $getterMethods = get_class_methods($instance);
        $mapperClass = self::mapperClassNameFrom($entityClass);

        if (in_array('get' . $mapperClass, $getterMethods)) {
            return call_user_func('self::get' . $mapperClass);
        } else {
            return new ('\App\Mapper\\' . $mapperClass);
        }
    }

    private static function mapperClassNameFrom(string $entityClass): string
    {
        $explodeEntityClass = explode('\\', $entityClass);
        $pureEntityClass = end($explodeEntityClass);
        return $pureEntityClass . 'Mapper';
    }

    private static function getRecipeMapper(): RecipeMapper
    {
        return new RecipeMapper(
            new ImageMapper,
            new InstructionMapper,
            new IngredientMapper,
        );
    }

    private static function getMealMapper(): MealMapper
    {
        return new MealMapper(
            new MealCategoryMapper,
            self::getRecipeMapper(),
            self::getUserGroupMapper(),
        );
    }

    private static function getUserGroupMapper(): UserGroupMapper
    {
        return new UserGroupMapper(
            new UserMapper,
        );
    }

    private static function getSettingsMapper(): SettingsMapper
    {
        return new SettingsMapper(
            new MealCategoryMapper,
            new UserMapper,
            self::getUserGroupMapper(),
        );
    }

    private static function getDayMapper(): DayMapper
    {
        return new DayMapper(
            self::getMealMapper(),
        );
    }
}
