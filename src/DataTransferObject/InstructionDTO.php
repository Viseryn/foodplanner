<?php namespace App\DataTransferObject;

/**
 * @implements DataTransferObject<Instruction>
 */
class InstructionDTO implements DataTransferObject
{
    private ?int $id = null;
    private ?string $instruction = null;

    public function getId(): ?int 
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getInstruction(): ?string
    {
        return $this->instruction;
    }

    public function setInstruction(?string $instruction): self
    {
        $this->instruction = $instruction;
        return $this;
    }
}
