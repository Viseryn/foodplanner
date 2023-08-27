<?php namespace App\Service;

use App\Entity\Instruction;
use Doctrine\Common\Collections\Collection;

/**
 * InstructionUtil
 */
class InstructionUtil
{
    /**
     * Turns a string which describes an instruction into an Instruction object and returns it.
     * 
     * @param string $instructionString A string that describes an instruction.
     * @return Instruction
     */
    public function transformStringToObject(string $instructionString): Instruction
    {
        // Create Instruction object and return it
        $instructionObject = (new Instruction)
            ->setInstruction($instructionString)
        ;

        return $instructionObject;
    }

    /**
     * Turns an array of strings, each describing an instruction, into an array of Instruction objects and returns it.
     * 
     * @param string[] $instructionStrings An array of strings that describe instructions.
     * @return Instruction[]
     */
    public function transformStringArrayToObjectArray(array $instructionStrings): array
    {
        $instructionObjects = [];

        foreach ($instructionStrings as $instructionString) {
            $instructionObject = $this->transformStringToObject($instructionString);
            $instructionObjects[] = $instructionObject;
        }

        return $instructionObjects;
    }

    /**
     * Turns an array of Instruction objects into an array of strings.
     *
     * @param Instruction[]|Collection<Instruction> $instructions An array or Collection of Instruction objects
     * @return string[]
     */
    public function transformObjectArrayToStringArray(array|Collection $instructions): array
    {
        $instructionStrings = [];

        foreach ($instructions as $instruction) {
            $instructionStrings[] = trim($instruction->getInstruction());
        }

        return $instructionStrings;
    }
}
