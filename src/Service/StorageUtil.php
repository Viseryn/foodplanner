<?php

namespace App\Service;

use App\Repository\IngredientRepository;
use App\Repository\StorageRepository;

/**
 * StorageUtil
 * 
 * A utility class for a Storage type. Any class that extends StorageUtil should be named 
 * {Storage}Util, where {Storage} is the name of a Storage object in CamelCase.
 * 
 * @method StorageUtil add()
 * @method StorageUtil editIngredient(array $ingredient)
 * @method StorageUtil replace(array $ingredientStrings)
 * @method StorageUtil deleteAll() abstract
 * @method Ingredient[] prepareIngredients(Ingredient[] &$ingredients) abstract
 */
abstract class StorageUtil
{
    protected IngredientRepository $ingredientRepository;
    protected IngredientUtil $ingredientUtil;
    protected StorageRepository $storageRepository;

    public function __construct(
        IngredientRepository $ingredientRepository, 
        IngredientUtil $ingredientUtil,
        StorageRepository $storageRepository,
    ) {
        $this->ingredientRepository = $ingredientRepository;
        $this->ingredientUtil = $ingredientUtil;
        $this->storageRepository = $storageRepository;
    }

    /**
     * Given an array of strings of which each describes an Ingredient object, creates new Ingredient 
     * objects from these strings and adds them to the database. The Ingredient objects are created 
     * by using the IngredientUtil::transformStringArrayToObjectArray() method and then prepared for 
     * the Storage by the self::prepareIngredients() method. An expected value for ingredientStrings 
     * could, for example, be ['200 g Spaghetti', 'Hartkäse', '2 1/2 Karotten'].
     *
     * @param array $ingredientStrings An array of strings that describe an Ingredient.
     * @return self
     */
    public function add(array $ingredientStrings): self
    {
        // Turn ingredientStrings into array of Ingredient objects
        $ingredients = $this->ingredientUtil
            ->transformStringArrayToObjectArray($ingredientStrings)
        ;

        // Prepare Ingredient objects for Storage
        $this->prepareIngredients($ingredients);

        // Add Ingredient objects to database
        foreach ($ingredients as $ingredient) {
            $this->ingredientRepository->save($ingredient, true);
        }

        return $this;
    }

    /**
     * Given an ingredient object from an API request, finds the corresponding Ingredient object in 
     * the database and updates its quantityValue, quantityUnit and name, where the new values are 
     * determined by the name specified in the request (it will contain a whole string that describes 
     * the ingredient). The new description is given by $ingredient['name'], where $ingredient is the 
     * argument. With the utilities from the IngredientUtil class, the new values can be set. After 
     * that, the Ingredient is saved in the database.
     *
     * @param array $ingredient An array that describes an ingredient object from an API request.
     * @return self
     */
    public function editIngredient(array $ingredient): self {
        // Find Ingredient object and change quantity and name
        $ingredientObject = $this->ingredientRepository->find($ingredient['id']);
        $ingredientObject
            ->setQuantityValue($this->ingredientUtil->getQuantityValueFromString($ingredient['name']))
            ->setQuantityUnit($this->ingredientUtil->getQuantityUnitFromString($ingredient['name']))
            ->setName($this->ingredientUtil->getNameFromString($ingredient['name']))
        ;

        // Save in database
        $this->ingredientRepository->save($ingredientObject, true);

        return $this;
    }

    /**
     * Replaces all Ingredient objects in a Storage with a new list of Ingredient objects that are 
     * given by an array of strings of which each describes an Ingredient object. The Ingredient 
     * objects are created by using the IngredientUtil::transformStringArrayToObjectArray() method 
     * and then prepared for the Storage by the self::prepareIngredients() method. An expected value 
     * for ingredientStrings could, for example, be ['200 g Spaghetti', 'Hartkäse', '2 1/2 Karotten'].
     *
     * @param array $ingredientStrings An array of strings that describe an Ingredient.
     * @return self
     */
    public function replace(array $ingredientStrings): self
    {
        $this->deleteAll();
        $this->add($ingredientStrings);

        return $this;
    }

    /**
     * Should delete all Ingredient objects from the database that belong to the Storage.
     *
     * @return self
     */
    abstract public function deleteAll(): StorageUtil;

    /**
     * Should prepare Ingredient objects for being added to a specific Storage. That can for example 
     * mean setting the 'checked' property or something else.
     *
     * @param array $ingredients
     * @return Ingredient[]
     */
    abstract protected function prepareIngredients(array &$ingredients): array;
}
