<?php namespace App\Service;

use App\Entity\EntityModel;
use Doctrine\Common\Collections\Collection;

/**
 * EntityUtil
 * 
 * An abstract class that can be extended by other util classes. Given some entity type, say 
 * Recipe, the corresponding RecipeUtil class can extend this class to get access to the 
 * methods getApiModel and getApiModels, of which the first one needs to be implemented.
 * This provides a unified way to transform some entity data into an array that is matching
 * the type specification in the TypeScript EntityModel.ts file.
 */
abstract class EntityUtil {
    /**
     * getApiModel
     * 
     * Given an entity object <Entity> that implements EntityModel, should return an array 
     * with the specifications given in the corresponding entity type definition in the
     * /assets/types/<Entity>Model.ts file.
     * 
     * @param EntityModel $entity An entity object that implements EntityModel.
     * @return array Returns an array matching the ts-type definition for that entity.
     *
     * @see ./assets/types/EntityModel.ts
     * 
     * @example 
     *     type RecipeModel = { id: number, title: string, ... }
     *     -> getApiModel($recipe) = ['id' => int, 'title' => string, ...]
     */
    abstract public function getApiModel(EntityModel $entity): array;

    /**
     * getApiModels
     * 
     * Given a collection (or an array) of entity objects, calls getApiModel on each and 
     * returns the results in an array.
     *
     * @param EntityModel[]|Collection<int, EntityModel> $entities A collection of entity objects that implement EntityModel.
     * @return array Returns an array with the results from getApiModel on each entity of the argument.
     */
    public function getApiModels(array|Collection $entities): array
    {
        $returnArray = [];

        foreach ($entities as $entity) {
            $returnArray[] = $this->getApiModel($entity);
        }

        return $returnArray;
    }
}
