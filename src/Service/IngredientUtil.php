<?php

namespace App\Service;

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
        if(count($quantityData) > 1) {
            return [
                (string) $quantityData[0], // The value is the first part
                implode(' ', array_slice($quantityData, 1)) // The unit might consist of more than one word
            ];
        }

        // If there is no whitespace, use regex to split
        preg_match('/(\d+|\d*\.\d+|\d+\/\d+)(\w*)/', $quantity, $quantityData);
        array_shift($quantityData);
        return $quantityData;
    }

    /**
     * Combines value and unit into a single string.
     *
     * @param string|null $quantityValue
     * @param string|null $quantityUnit
     * @return string|null
     */
    public function quantityFull(?string $quantityValue, ?string $quantityUnit): ?string
    {
        return $quantityValue . ' ' . $quantityUnit;
    }
}