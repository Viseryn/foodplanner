<?php namespace App\Mapper;

use App\DataTransferObject\ImageDTO;
use App\DataTransferObject\IngredientExportDto;
use App\DataTransferObject\InstructionExportDto;
use App\DataTransferObject\RecipeExportDto;
use App\Entity\Ingredient;
use App\Entity\Instruction;
use App\Entity\Recipe;
use App\Service\Files\RecipeImageManager;
use App\Service\Files\ThumbnailManager;
use Doctrine\Common\Collections\ArrayCollection;

final class RecipeImportMapper {

    public function __construct(
        private readonly RecipeImageManager $recipeImageManager,
        private readonly ThumbnailManager $thumbnailManager,
    ) {}

    /**
     * Transforms an associative array coming from json_decode into a RecipeExportDto.
     */
    public function parseRecipeExportDto(array $recipeData): RecipeExportDto {
        $recipeExportDto = new RecipeExportDto();

        $recipeExportDto->title = $recipeData['title'];
        $recipeExportDto->portionSize = $recipeData['portionSize'];

        $recipeExportDto->ingredients = new ArrayCollection();
        foreach ($recipeData['ingredients'] as $ingredientData) {
            $ingredientExportDto = new IngredientExportDto();
            $ingredientExportDto->name = $ingredientData['name'];
            $ingredientExportDto->quantityValue = $ingredientData['quantityValue'];
            $ingredientExportDto->quantityUnit = $ingredientData['quantityUnit'];
            $recipeExportDto->ingredients->add($ingredientExportDto);
        }

        $recipeExportDto->instructions = new ArrayCollection();
        foreach ($recipeData['instructions'] as $instructionData) {
            $instructionExportDto = new InstructionExportDto();
            $instructionExportDto->instruction = $instructionData['instruction'];
            $recipeExportDto->instructions->add($instructionExportDto);
        }

        $recipeExportDto->image = $recipeData['image'];

        return $recipeExportDto;
    }

    public function toRecipe(RecipeExportDto $recipeExportDto): Recipe {
        $recipe = new Recipe();

        $recipe->setTitle($recipeExportDto->title);
        $recipe->setPortionSize($recipeExportDto->portionSize);

        foreach ($recipeExportDto->ingredients as $ingredient) {
            $recipeIngredient = $this->toIngredient($ingredient);
            $recipe->addIngredient($recipeIngredient);
        }

        foreach ($recipeExportDto->instructions as $instruction) {
            $recipeInstruction = $this->toInstruction($instruction);
            $recipe->addInstruction($recipeInstruction);
        }

        if ($recipeExportDto->image != null) {
            $imageDto = $this->toImageDto($recipeExportDto->image);
            $image = $this->recipeImageManager->upload($imageDto);
            $this->thumbnailManager->upload($imageDto);
            $recipe->setImage($image);
        }

        return $recipe;
    }

    private function toIngredient(IngredientExportDto $ingredientExportDto): Ingredient {
        $ingredient = new Ingredient();
        $ingredient->setName($ingredientExportDto->name);
        $ingredient->setQuantityValue($ingredientExportDto->quantityValue);
        $ingredient->setQuantityUnit($ingredientExportDto->quantityUnit);
        return $ingredient;
    }

    private function toInstruction(InstructionExportDto $instructionExportDto): Instruction {
        $instruction = new Instruction();
        $instruction->setInstruction($instructionExportDto->instruction);
        return $instruction;
    }

    private function toImageDto(string $imageExport): ImageDTO {
        $imageDto = new ImageDTO();
        $imageDto->setImageContents($imageExport);
        $imageDto->setPublic(true);
        $imageDto->setDirectory('/img/recipes');
        $imageDto->setFilename($imageExport . '.png');
        return $imageDto;
    }
}
