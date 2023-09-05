<?php namespace App\Tests\Service;

use App\DataTransferObject\InstructionDTO;
use App\DataTransferObject\RecipeDTO;
use App\Entity\Instruction;
use App\Entity\Recipe;
use App\Service\DTOSerializer;
use PHPUnit\Framework\TestCase;

final class DTOSerializerTest extends TestCase
{
    public function test_serialize_InstructionDTO()
    {
        $instruction = (new Instruction)->setInstruction("Test");
        $instructionDTO = new InstructionDTO($instruction);

        $expectedResult = [
            "id" => null,
            "instruction" => "Test",
        ];

        $this->assertEquals($expectedResult, DTOSerializer::serialize($instructionDTO));
    }

    public function test_serialize_RecipeDTO()
    {
        $instruction = (new Instruction)
            ->setInstruction("Test");
        $recipe = (new Recipe)
            ->setTitle("Title")
            ->setPortionSize(4)
            ->addInstruction($instruction);
        $recipeDTO = new RecipeDTO($recipe);

        $expectedResult = [
            "id" => null,
            "title" => "Title",
            "portionSize" => 4,
            "instructions" => [
                0 => [
                    "id" => null,
                    "instruction" => "Test",
                ],
            ],
            "ingredients" => [],
            "image" => null,
        ];

        $this->assertEquals($expectedResult, DTOSerializer::serialize($recipeDTO));
    }
}
