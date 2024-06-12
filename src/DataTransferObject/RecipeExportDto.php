<?php namespace App\DataTransferObject;

use Doctrine\Common\Collections\ReadableCollection;

final class RecipeExportDto {
    public string $title;
    public int $portionSize;
    /** @var ReadableCollection<IngredientExportDto> */
    public ReadableCollection $ingredients;
    /** @var ReadableCollection<InstructionExportDto> */
    public ReadableCollection $instructions;
    public string $image;
}
