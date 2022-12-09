<?php

namespace App\Service;

use App\Entity\Instruction;
use Doctrine\Common\Collections\Collection;
use Exception;

class InstructionUtil 
{
    /**
     * Splits instructions between new lines and returns an 
     * array of Instruction objects.
     *
     * @param string|null $instructions
     * @return array|Instruction[]
     */
    public function instructionSplit(?string $instructions): array
    {
        $instructionArray = [];

        // Split string after newlines
        $instArray = preg_split('/\r\n|\r|\n/', $instructions);

        // Remove all empty elements from the array
        $instArray = array_filter($instArray);

        // If array is empty, we are done
        if (count($instArray) === 0) {
            return [];
        }

        // Create Instruction objects
        foreach ($instArray as $inst) {
            array_push(
                $instructionArray, 
                (new Instruction())->setInstruction($inst)
            );
        }

        return $instructionArray;
    }

    /**
     * Combines an array of Instruction objects into a single string.
     *
     * @param Collection|null $instructionArray
     * @return string|null
     */
    public function instructionString(?Collection $instructionArray): ?string
    {
        // Check if all elements are Instruction objects
        foreach ($instructionArray as $instruction) {
            if (!is_a($instruction, Instruction::class)) {
                throw new Exception('One of the elements of $instructionArray is not an Instruction object.');
            }
        }

        // Combine all elements to one string
        $instructionString = implode("\r\n\r\n", $instructionArray->toArray());

        return $instructionString;
    }
}
