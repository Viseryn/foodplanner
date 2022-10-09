<?php

namespace App\Service;

use App\Entity\Ingredient;
use Doctrine\Common\Collections\Collection;
use Exception;

class IngredientUtil 
{
    /**
     * Returns an array of the form 
     * [?string quantityValue, ?string quantityUnit]
     *
     * @param string|null $quantity
     * @return array
     */
    public function quantitySplit(?string $quantity): array
    {
        // If empty, then return empty array
        if($quantity === null) {
            return [null, null];
        }

        // If value and unit are already split by a whitespace, we are done
        $quantityData = explode(' ', $quantity);

        if (count($quantityData) > 1) {
            return [
                (string) $quantityData[0], // The value is the first part
                implode(' ', array_slice($quantityData, 1)) // The unit might consist of more than one word
            ];
        }

        // If there is no whitespace:
        // First, split between number and word part
        preg_match('/^(\d*|\d*\.\d+|\d+\/\d+)(\w*)$/', $quantity, $quantityData);
        array_shift($quantityData);

        // Check if there was a match with both groups
        if (count($quantityData) < 2) {
            throw new Exception('The parameter $quantity is of wrong format.');
        }

        return $quantityData;
    }
    
    /**
     * Splits ingredients between new lines and returns an 
     * array of Ingredient objects.
     *
     * @param string|null $ingredients
     * @return array|Ingredient[]
     */
    public function ingredientSplit(?string $ingredients): array
    {
        $ingredientArray = [];

        // Split string after newlines
        $ingArray = preg_split('/\r\n|\r|\n/', $ingredients);

        // Remove all empty elements from the array
        $ingArray = array_filter($ingArray);

        // If array is empty, we are done
        if (count($ingArray) === 0) {
            return [];
        }

        // Create Instruction objects
        foreach ($ingArray as $ing) {
            $ingredient = new Ingredient();

            // The split between quantity and name of the ingredient
            // is not trivial, since the unit can consist of more 
            // than one word. The first option would be to have 
            // ingredients in the format "<name> <value> <unit>", 
            // which is quite unnatural. The second option, which 
            // is chosen here, is to compare with a list of units.
            $allowedUnits = [
                'gehäufter TL', 'gehäufte TL', 
                'gehäufter EL', 'gehäufte EL', 
                'gehäufter Teelöffel', 'gehäufte Teelöffel', 
                'gehäufter Esslöffel', 'gehäufte Esslöffel', 
                'n. B.', 'g', 'kg', 'ml', 'l', 'EL', 'TL', 
                'Tube', 'Tuben', 'Bund', 'Bünde',
                'Glas', 'Gläser', 'Packung', 'Packungen',
                'kl. Glas', 'kleines Glas', 'kl. Gläser', 
                'kleine Gläser',
                'Päckchen', 'Pck.', 'Msp.', 'Liter',
                'Messerspitze', 'Messerspitzen',
                'Prise', 'Prisen', 'Würfel', 'Stange', 'Stangen',
                'Paket', 'Pakete', 'Beutel', 'Zweig', 'Zweige',
                'Zehe', 'Zehen',
            ];

            // Find quantity value with regexp
            preg_match('/^(\d*|\d*\.\d+|\d+\/\d+)(\D+)$/', $ing, $ingData);
            array_shift($ingData);

            // Check if there is a quantity value
            if (count($ingData) > 1) {
                $nonValuePart = explode(' ', $ingData[1]);

                // Remove first element of the non-value part if empty
                if ($nonValuePart[0] == '') {
                    array_shift($nonValuePart);
                }

                // Check for unit.
                // $i is the number of words of the unit;
                // so first we test one word, then two words, ...
                for ($i = 1; $i <= count($nonValuePart); $i++) {
                    $unitCandidate = '';

                    // Define the unit candidate
                    for ($j = 0; $j < $i; $j++) {
                        $unitCandidate .= $nonValuePart[$j];
                        if ($j != $i - 1) {
                            $unitCandidate .= ' ';
                        }
                    }
                    
                    // Check if unit candidate is allowed unit
                    if (in_array($unitCandidate, $allowedUnits)) {
                        $name = implode(' ', array_slice($nonValuePart, $i));
                        $ingredient
                            ->setQuantity([$ingData[0], $unitCandidate])
                            ->setName($name)
                        ;
                    }
                }

                // Check if name is still not set.
                // In this case, the quantity is also not set yet.
                if ($ingredient->getName() === null) {
                    $ingredient
                        ->setQuantity([$ingData[0], null])
                        ->setName(implode(' ', $nonValuePart))
                    ;
                }
            }
            // If there is no quantity value, just set name
            else {
                $ingredient->setName($ing);
            }

            array_push($ingredientArray, $ingredient);
        }

        return $ingredientArray;
    }

    /**
     * Combines an array of Ingredient objects into a single string.
     *
     * @param Collection|null $ingredientArray
     * @return string|null
     */
    public function ingredientString(?Collection $ingredientArray): ?string
    {
        // Check if all elements are Ingredient objects
        foreach ($ingredientArray as $ingredient) {
            if (!is_a($ingredient, Ingredient::class)) {
                throw new Exception('One of the elements of $ingredientArray is not an Ingredient object.');
            }
        }

        $ingredientString = '';
        $i = 0;
        
        // Combine all elements to one string
        foreach ($ingredientArray as $ingredient) {
            if ($ingredient->getQuantity() != '') {
                $ingredientString .= $ingredient->getQuantity() . ' ';
            }

            $ingredientString .= $ingredient; 

            if ($i != count($ingredientArray) - 1) {
                $ingredientString .= "\r\n";
            }

            $i++;
        }

        return $ingredientString;
    }
}