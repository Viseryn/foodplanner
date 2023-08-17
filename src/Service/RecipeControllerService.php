<?php namespace App\Service;

use App\Entity\Recipe;
use App\Repository\MealRepository;
use App\Repository\RecipeRepository;

class RecipeControllerService
{
    public function __construct(
        private MealRepository $mealRepository,
        private RecipeRepository $recipeRepository,
    ) {}

    public function removeRecipe(Recipe $recipe): void
    {
        $meals = $this->mealRepository->findBy(['recipe' => $recipe->getId()]);
        foreach ($meals as $meal) {
            $this->mealRepository->remove($meal, true);
        }

        $this->recipeRepository->remove($recipe, true);
    }
}
