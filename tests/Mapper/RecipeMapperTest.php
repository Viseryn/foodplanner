<?php namespace App\Tests\Mapper;

use App\DataTransferObject\InstructionDTO;
use App\DataTransferObject\RecipeDTO;
use App\Entity\Instruction;
use App\Entity\Recipe;
use App\Mapper\ImageMapper;
use App\Mapper\IngredientMapper;
use App\Mapper\InstructionMapper;
use App\Mapper\RecipeMapper;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\TestCase;

final class RecipeMapperTest extends TestCase
{
    public function __construct(
        private readonly RecipeMapper $recipeMapper = new RecipeMapper(
            new ImageMapper,
            new InstructionMapper,
            new IngredientMapper,
        ),
    ) {
        parent::__construct();
    }

    public function test_dtoToEntity()
    {
        $instruction = (new InstructionDTO)->setInstruction("Test");
        $recipeDto = (new RecipeDTO)->setTitle("Test")
                                    ->setPortionSize(4)
                                    ->setInstructions(new ArrayCollection([$instruction]))
                                    ->setIngredients(new ArrayCollection());

        $recipe = (new Recipe)->setTitle("Test")
            ->setPortionSize(4)
            ->addInstruction((new Instruction)->setInstruction("Test"));

        $this->assertEquals($recipe, $this->recipeMapper->dtoToEntity($recipeDto));
    }
}
