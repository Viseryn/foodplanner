<?php namespace App\Service;

use App\Entity\EntityModel;
use App\Entity\Ingredient;
use Doctrine\Common\Collections\Collection;

/**
 * IngredientUtil
 */
class IngredientUtil extends EntityUtil
{
    /**
     * Given a string that describes an Ingredient, returns the quantityValue and the rest of the 
     * Ingredient description in an array. Is only a helper method for getQuantityValueFromString() 
     * and getQuantityUnitAndNameString().
     *
     * @param string $ingredientString A string that describes an ingredient.
     * @return string[] The quantityValue of the Ingredient and the rest of the string
     */
    private function getQuantityValueAndRestFromString(string $ingredientString): array
    {
       // Find quantity value with regular expression.
       // Note that the second matching group doesn't allow numbers, but the third does, so we combine them.
       preg_match('/^([\d\.\/\s]*)(\D+)(.*)/', $ingredientString, $matches);

       $quantityValue = trim($matches[1] ?? '');
       $quantityUnitAndName = trim(($matches[2] ?? '') . ($matches[3] ?? ''));

       return [$quantityValue, $quantityUnitAndName];
    }

    /**
     * Given a string that describes an Ingredient, returns the quantityUnit and the name of the 
     * Ingredient in an array. Is only a helper method for getQuantityUnitFromString() and 
     * getNameFromString().
     *
     * @param string $ingredientString A string that describes an ingredient.
     * @return string[] The quantityUnit and the name of the Ingredient
     */
    private function getQuantityUnitAndNameFromString(string $ingredientString): array
    {
        /**
         * The quantity units that are declared as allowed. If a unit appears that is not on this 
         * list, then it will be considered part of the ingredient name.
         * 
         * @var string[]
         */
       $allowedUnits = [
           'gehäufter TL', 'gehäufte TL', 
           'gehäufter EL', 'gehäufte EL', 
           'gehäufter Teelöffel', 'gehäufte Teelöffel', 
           'gehäufter Esslöffel', 'gehäufte Esslöffel', 
           'n. B.', 'g', 'kg', 'ml', 'l', 'EL', 'TL', 
           'Tube', 'Tuben', 'Bund', 'Bünde',
           'Glas', 'Gläser', 'Packung', 'Packungen',
           'kl. Glas', 'kleines Glas', 'kl. Gläser', 
           'kleine Gläser', 'Becher',
           'Päckchen', 'Pck.', 'Msp.', 'Liter',
           'Messerspitze', 'Messerspitzen',
           'Prise', 'Prisen', 'Würfel', 'Stange', 'Stangen',
           'Paket', 'Pakete', 'Beutel', 'Zweig', 'Zweige',
           'Zehe', 'Zehen',
       ];

        // Get quantityUnit and name
        $quantityUnitAndName = $this->getQuantityValueAndRestFromString($ingredientString)[1];

        // Find quantity unit with regular expression. Note that the name will appear in the third 
        // matching group, since the second group catches a whitespace between unit and name.
        $regex = '/^((' . implode('|', $allowedUnits) . ')\s+)?(.*)/';
        preg_match($regex, $quantityUnitAndName, $matches);

        $quantityUnit = trim($matches[1] ?? '');

        // Remove extra whitespaces in the name.
        $name = trim(preg_replace('/\s+/', ' ', ($matches[3] ?? '')));

        // Return quantityUnit and name
        return [$quantityUnit, $name];
    }

    /**
     * Given a string that describes an Ingredient, returns the quantityValue of the Ingredient.
     *
     * @param string $ingredientString A string that describes an ingredient.
     * @return string The quantityValue of the Ingredient
     */
    public function getQuantityValueFromString(string $ingredientString): string 
    {
        return $this->getQuantityValueAndRestFromString($ingredientString)[0];
    }

    /**
     * Given a string that describes an Ingredient, returns the quantityUnit of the Ingredient.
     *
     * @param string $ingredientString A string that describes an ingredient.
     * @return string The quantityUnit of the Ingredient
     */
    public function getQuantityUnitFromString(string $ingredientString): string 
    {
        return $this->getQuantityUnitAndNameFromString($ingredientString)[0];
    }

    /**
     * Given a string that describes an Ingredient, returns the name of the Ingredient.
     *
     * @param string $ingredientString A string that describes an ingredient.
     * @return string The name of the Ingredient
     */
    public function getNameFromString(string $ingredientString): string 
    {
        return $this->getQuantityUnitAndNameFromString($ingredientString)[1];
    }

    /**
     * Turns a string which describes an ingredient into an Ingredient object and returns it. The 
     * Ingredient object will have the following properties set: name, quantityValue, quantityUnit.
     * 
     * @param string $ingredientString A string that describes an ingredient.
     * @return Ingredient
     */
    public function transformStringToObject(string $ingredientString): Ingredient
    {
        // Create Ingredient object and return it
        $ingredientObject = (new Ingredient)
            ->setQuantityValue($this->getQuantityValueFromString($ingredientString))
            ->setQuantityUnit($this->getQuantityUnitFromString($ingredientString))
            ->setName($this->getNameFromString($ingredientString))
        ;

        return $ingredientObject;
    }

    /**
     * Turns an array of strings, each describing an ingredient, into an array of Ingredient 
     * objects and returns it. The Ingredient objects will have the following properties set: 
     * name, quantityValue, quantityUnit.
     * 
     * @param string[] $ingredientStrings An array of strings that describe ingredients.
     * @return Ingredient[]
     */
    public function transformStringArrayToObjectArray(array $ingredientStrings): array
    {
        $ingredientObjects = [];

        foreach ($ingredientStrings as $ingredientString) {
            $ingredientObject = $this->transformStringToObject($ingredientString);
            $ingredientObjects[] = $ingredientObject;
        }

        return $ingredientObjects;
    }

    /**
     * Turns an array of Ingredient objects into an array of strings of the form '{quantityValue} {quantityUnit} {name}'.
     *
     * @param Ingredient[]|Collection<Ingredient> $ingredients An array or Collection of Ingredient objects
     * @return string[]
     */
    public function transformObjectArrayToStringArray(array|Collection $ingredients): array
    {
        $ingredientStrings = [];

        foreach ($ingredients as $ingredient) {
            $ingredientString = '' . $ingredient->getQuantityValue();
            $ingredientString .= ' ' . $ingredient->getQuantityUnit();
            $ingredientString .= ' ' . $ingredient->getName();

            // Remove leading whitespace (if exists)
            $ingredientStrings[] = trim($ingredientString);
        }

        return $ingredientStrings;
    }

    /** @param Ingredient $ingredient */
    public function getApiModel(EntityModel $ingredient): array {
        return [
            'id' => $ingredient->getId(),
            'name' => $ingredient->getName(),
            'quantityValue' => $ingredient->getQuantityValue(),
            'quantityUnit' => $ingredient->getQuantityUnit(),
            'position' => $ingredient->getPosition(),
            'checked' => $ingredient->isChecked(),
        ];
    }
}
