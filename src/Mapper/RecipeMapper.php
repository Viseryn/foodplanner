<?php namespace App\Mapper;

use App\DataTransferObject\RecipeDTO;
use App\Entity\Recipe;

/**
 * @implements Mapper<Recipe>
 */
final class RecipeMapper implements Mapper
{
    public function __construct(
        private readonly ImageMapper $imageMapper,
        private readonly InstructionMapper $instructionMapper,
        private readonly IngredientMapper $ingredientMapper,
    ) {
    }

    /**
     * @param RecipeDTO $dto
     * @return Recipe
     */
    public function dtoToEntity($dto): Recipe
    {
        $recipe = (new Recipe)->setTitle($dto->getTitle())
                              ->setPortionSize($dto->getPortionSize())
                              ->setImage($this->imageMapper->dtoToEntity($dto->getImage()));

        $ingredients = $dto->getIngredients()
                           ->map(fn ($ingredientDto) => $this->ingredientMapper->dtoToEntity($ingredientDto));
        foreach ($ingredients as $ingredient) {
            $recipe->addIngredient($ingredient);
        }

        $instructions = $dto->getInstructions()
                            ->map(fn ($instructionDto) => $this->instructionMapper->dtoToEntity($instructionDto));
        foreach ($instructions as $instruction) {
            $recipe->addInstruction($instruction);
        }

        return $recipe;
    }

    /**
     * @param Recipe $entity
     * @return RecipeDTO
     */
    public function entityToDto($entity): RecipeDTO
    {
        return (new RecipeDTO)->setId($entity->getId())
                              ->setTitle($entity->getTitle())
                              ->setPortionSize($entity->getPortionSize())
                              ->setImage($this->imageMapper->entityToDto($entity->getImage()))
                              ->setIngredients(
                                  $entity->getIngredients()
                                         ->map(fn ($ingredient) => $this->ingredientMapper->entityToDto($ingredient)),
                              )
                              ->setInstructions(
                                  $entity->getInstructions()
                                         ->map(fn ($instruction,
                                         ) => $this->instructionMapper->entityToDto($instruction)),
                              );
    }
}
