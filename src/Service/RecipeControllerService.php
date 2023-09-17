<?php namespace App\Service;

use App\DataTransferObject\RecipeDTO;
use App\Entity\Recipe;
use App\Mapper\Mapper;
use App\Mapper\MapperFactory;
use App\Repository\MealRepository;
use App\Repository\RecipeRepository;
use Doctrine\Common\Collections\ArrayCollection;

class RecipeControllerService
{
    private Mapper $mapper;

    public function __construct(
        private readonly MealRepository $mealRepository,
        private readonly RecipeRepository $recipeRepository,
        private readonly MapperFactory $mapperFactory,
    ) {
        $this->mapper = $this->mapperFactory::getMapperFor(Recipe::class);
    }

    /**
     * @return ArrayCollection<RecipeDTO>
     */
    public function getAllRecipes(): ArrayCollection
    {
        return (new ArrayCollection(
            $this->recipeRepository->findBy([], ['title' => 'ASC']),
        ))->map(fn ($recipe) => $this->mapper->entityToDto($recipe));
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
