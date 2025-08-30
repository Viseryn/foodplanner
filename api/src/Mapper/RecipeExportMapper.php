<?php

namespace App\Mapper;

use App\ApiResource\IngredientExport;
use App\ApiResource\InstructionExport;
use App\ApiResource\RecipeExport;
use App\Entity\Image;
use App\Entity\Ingredient;
use App\Entity\Instruction;
use App\Entity\Recipe;
use App\Service\Files\Base64Encoder;
use App\Service\Files\DirectoryParser;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\ReadableCollection;

final class RecipeExportMapper {
    use Base64Encoder;
    use DirectoryParser;

    public function __construct(
        private readonly string $targetDirectory,
    ) {
        // $targetDirectory is injected via config/services.yaml
    }

    public function toExportDto(Recipe $recipe): RecipeExport {
        return new RecipeExport(
            $recipe->getId(),
            $recipe->getTitle(),
            $recipe->getPortionSize(),
            $this->toIngredientExportDtos($recipe->getIngredients()),
            $this->toInstructionExportDtos($recipe->getInstructions()),
            $this->toBase64String($recipe->getImage()),
        );
    }

    /**
     * @param ReadableCollection<Ingredient> $ingredients
     * @return ReadableCollection<IngredientExport>
     */
    private function toIngredientExportDtos(ReadableCollection $ingredients): ReadableCollection {
        $ingredientExportDtos = new ArrayCollection();

        foreach ($ingredients as $ingredient) {
            $ingredientExportDto = new IngredientExport(
                $ingredient->getName(),
                $ingredient->getQuantityValue(),
                $ingredient->getQuantityUnit(),
            );
            $ingredientExportDtos->add($ingredientExportDto);
        }

        return $ingredientExportDtos;
    }

    /**
     * @param ReadableCollection<Instruction> $instructions
     * @return ReadableCollection<InstructionExport>
     */
    private function toInstructionExportDtos(ReadableCollection $instructions): ReadableCollection {
        $instructionExportDtos = new ArrayCollection();

        foreach ($instructions as $instruction) {
            $instructionExportDto = new InstructionExport($instruction->getInstruction());
            $instructionExportDtos->add($instructionExportDto);
        }

        return $instructionExportDtos;
    }

    private function toBase64String(Image|null $image): string {
        if ($image === null) {
            return "";
        }

        $uploadDirectory = $this->getUploadDirectory(
            $this->targetDirectory,
            $image->getDirectory(),
            $image->isPublic(),
        );

        $imageFile = file_get_contents($uploadDirectory . $image->getFilename());

        return $this->encodeBase64($imageFile);
    }

    public function toArray(RecipeExport $recipeExportDto): array {
        return [
            "title" => $recipeExportDto->getTitle(),
            "portionSize" => $recipeExportDto->getPortionSize(),
            "ingredients" => $recipeExportDto->getIngredients()->toArray(),
            "instructions" => $recipeExportDto->getInstructions()->toArray(),
            "image" => $recipeExportDto->getImage(),
        ];
    }
}
