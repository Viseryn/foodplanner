<?php namespace App\Tests\Service;

use App\Entity\Instruction;
use App\Entity\Recipe;
use App\Mapper\Mapper;
use App\Mapper\MapperFactory;
use App\Service\DtoSerializer;
use PHPUnit\Framework\TestCase;

final class DtoSerializerTest extends TestCase
{
    /** @var Mapper<Instruction> */
    private Mapper $instructionMapper;
    /** @var Mapper<Recipe> */
    private Mapper $recipeMapper;

    protected function setUp(): void
    {
        $this->instructionMapper = MapperFactory::getMapperFor(Instruction::class);
        $this->recipeMapper = MapperFactory::getMapperFor(Recipe::class);
    }

    public function test_serialize_InstructionDTO()
    {
        $instruction = (new Instruction)->setInstruction("Test");
        $instructionDTO = $this->instructionMapper->entityToDto($instruction);

        $expectedResult = [
            "id" => null,
            "instruction" => "Test",
        ];

        $this->assertEquals($expectedResult, DtoSerializer::serialize($instructionDTO));
    }

    public function test_serialize_RecipeDTO()
    {
        $instruction = (new Instruction)
            ->setInstruction("Test");
        $recipe = (new Recipe)
            ->setTitle("Title")
            ->setPortionSize(4)
            ->addInstruction($instruction);
        $recipeDTO = $this->recipeMapper->entityToDto($recipe);

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

        $this->assertEquals($expectedResult, DtoSerializer::serialize($recipeDTO));
    }
}
