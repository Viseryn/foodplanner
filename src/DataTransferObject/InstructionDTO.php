<?php namespace App\DataTransferObject;

use App\Entity\Instruction;

class InstructionDTO implements DataTransferObject
{
    private ?int $id;
    private ?string $instruction;

    public function __construct(Instruction $instruction) 
    {
        $this->id = $instruction->getId();
        $this->instruction = $instruction->getInstruction();
    }

    public function getId(): ?int 
    {
        return $this->id;
    }

    public function getInstruction(): ?string
    {
        return $this->instruction;
    }
}
