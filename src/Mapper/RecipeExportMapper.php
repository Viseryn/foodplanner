<?php namespace App\Mapper;

use App\DataTransferObject\IngredientExportDto;
use App\DataTransferObject\InstructionExportDto;
use App\DataTransferObject\RecipeExportDto;
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

    public function toExportDto(Recipe $recipe): RecipeExportDto {
        $recipeExportDto = new RecipeExportDto();

        $recipeExportDto->title = $recipe->getTitle();
        $recipeExportDto->portionSize = $recipe->getPortionSize();
        $recipeExportDto->ingredients = $this->toIngredientExportDtos($recipe->getIngredients());
        $recipeExportDto->instructions = $this->toInstructionExportDtos($recipe->getInstructions());
        $recipeExportDto->image = $this->toBase64String($recipe->getImage());

        return $recipeExportDto;
    }

    /**
     * @param ReadableCollection<Ingredient> $ingredients
     * @return ReadableCollection<IngredientExportDto>
     */
    private function toIngredientExportDtos(ReadableCollection $ingredients): ReadableCollection {
        $ingredientExportDtos = new ArrayCollection();

        foreach ($ingredients as $ingredient) {
            $ingredientExportDto = new IngredientExportDto();
            $ingredientExportDto->name = $ingredient->getName();
            $ingredientExportDto->quantityValue = $ingredient->getQuantityValue();
            $ingredientExportDto->quantityUnit = $ingredient->getQuantityUnit();
            $ingredientExportDtos->add($ingredientExportDto);
        }

        return $ingredientExportDtos;
    }

    /**
     * @param ReadableCollection<Instruction> $instructions
     * @return ReadableCollection<InstructionExportDto>
     */
    private function toInstructionExportDtos(ReadableCollection $instructions): ReadableCollection {
        $instructionExportDtos = new ArrayCollection();

        foreach ($instructions as $instruction) {
            $instructionExportDto = new InstructionExportDto();
            $instructionExportDto->instruction = $instruction->getInstruction();
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

        return base64_encode($imageFile);
    }

    public function toArray(RecipeExportDto $recipeExportDto): array {
        return [
            'title' => $recipeExportDto->title,
            'portionSize' => $recipeExportDto->portionSize,
            'ingredients' => $recipeExportDto->ingredients->toArray(),
            'instructions' => $recipeExportDto->instructions->toArray(),
            'image' => $recipeExportDto->image,
        ];
    }
}
