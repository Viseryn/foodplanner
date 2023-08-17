<?php namespace App\Service;

use App\DataTransferObject\RecipeDTO;
use App\Entity\Recipe;
use App\Repository\MealRepository;
use App\Repository\RecipeRepository;
use Doctrine\Common\Collections\ArrayCollection;

class RecipeControllerService
{
    public function __construct(
        private MealRepository $mealRepository,
        private RecipeRepository $recipeRepository,
    ) {}

    /**
     * @return ArrayCollection<RecipeDTO>
     */
    public function getAllRecipes(): ArrayCollection
    {
        return (new ArrayCollection(
            $this->recipeRepository->findBy([], ['title' => 'ASC'])
        ))->map(fn ($recipe) => new RecipeDTO($recipe));
    }

    public function removeRecipe(Recipe $recipe): void
    {
        $meals = $this->mealRepository->findBy(['recipe' => $recipe->getId()]);
        foreach ($meals as $meal) {
            $this->mealRepository->remove($meal, true);
        }

        $this->recipeRepository->remove($recipe, true);
    }
}
