<?php namespace App\Mapper;

use App\DataTransferObject\InstructionDTO;
use App\Entity\Instruction;

/**
 * @implements Mapper<Instruction>
 */
final class InstructionMapper implements Mapper
{
    /**
     * @param InstructionDTO $dto
     * @return Instruction
     */
    public function dtoToEntity($dto): Instruction
    {
        return (new Instruction)->setInstruction($dto->getInstruction());
    }

    /**
     * @param Instruction $entity
     * @return InstructionDTO
     */
    public function entityToDto($entity): InstructionDTO
    {
        return (new InstructionDTO)->setId($entity->getId())
                                   ->setInstruction($entity->getInstruction());
    }
}
