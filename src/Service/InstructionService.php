<?php namespace App\Service;

use App\Entity\Instruction;
use Doctrine\Common\Collections\ArrayCollection;

final class InstructionService
{
    public function mapInstructionModelToEntity(object $instructionModel): Instruction
    {
        return (new Instruction)->setInstruction($instructionModel->instruction);
    }

    /**
     * @param object[] $instructionModels
     * @return ArrayCollection<Instruction>
     */
    public function mapInstructionModelsToEntities(array $instructionModels): ArrayCollection
    {
        /** @var ArrayCollection<Instruction> $instructions */
        $instructions = new ArrayCollection();
        foreach ($instructionModels as $instructionModel) {
            $instructions->add($this->mapInstructionModelToEntity($instructionModel));
        }
        return $instructions;
    }
}
