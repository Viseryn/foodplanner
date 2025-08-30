<?php

namespace App\ApiResource;

use Symfony\Component\Serializer\Annotation\Groups;

final readonly class InstructionExport {
    #[Groups(["recipe:export"])]
    private string $instruction;

    public function __construct(string $instruction) {
        $this->instruction = $instruction;
    }

    public function getInstruction(): string {
        return $this->instruction;
    }
}
