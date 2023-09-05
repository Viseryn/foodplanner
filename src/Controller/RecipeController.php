<?php namespace App\Controller;

use App\DataTransferObject\RecipeDTO;
use App\Entity\Recipe;
use App\Repository\RecipeRepository;
use App\Service\DTOSerializer;
use App\Service\FileUploader;
use App\Service\RecipeControllerService;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Recipe API
 */
#[Route('/api/recipes')]
class RecipeController extends AbstractController
{
    public function __construct(
        private FileUploader $fileUploader,
        private RecipeControllerService $recipeControllerService,
        private RecipeRepository $recipeRepository,
        private RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ) {}

    #[Route('', name: 'api_recipes_getAll', methods: ['GET'])]
    public function getAll(): Response
    {
        $recipeDTOs = $this->recipeControllerService->getAllRecipes();
        return DTOSerializer::getResponse($recipeDTOs);
    }

    #[Route('', name: 'api_recipe_post', methods: ['POST'])]
    public function post(Request $request): Response
    {
        $data = json_decode($request->getContent(), false);
        $recipe = $this->recipeControllerService->mapRecipeModelToEntity($data);
        $this->recipeRepository->save($recipe, true);

        $this->refreshDataTimestampUtil->updateTimestamp();
        return DTOSerializer::getResponse(new RecipeDTO($recipe));
    }

    /** @todo PUT method is not working. */
    #[Route('/{id}', name: 'api_recipes_put', methods: ['POST'])]
    public function put(Recipe $recipe, Request $request): Response
    {
        $data = json_decode($request->getContent(), false);
        $newRecipe = $this->recipeControllerService->mapRecipeModelToEntity($data);

        $recipe->setTitle($newRecipe->getTitle())
               ->setPortionSize($newRecipe->getPortionSize());
        foreach ($recipe->getIngredients() as $ingredient) {
            $recipe->removeIngredient($ingredient);
        }
        foreach ($recipe->getInstructions() as $instruction) {
            $recipe->removeInstruction($instruction);
        }
        foreach ($newRecipe->getIngredients() as $ingredient) {
            $recipe->addIngredient($ingredient);
        }
        foreach ($newRecipe->getInstructions() as $instruction) {
            $recipe->addInstruction($instruction);
        }
        $this->recipeRepository->save($recipe, true);

        $this->refreshDataTimestampUtil->updateTimestamp();
        return DTOSerializer::getResponse(new RecipeDTO($recipe));
    }

    /**
     * This PATCH API is only usable for updating or removing the recipe's image.
     * It expects a JSON object of type ImageUploadModel.
     */
    #[Route('/{id}/image', name: 'api_recipes_patch', methods: ['PATCH'])]
    public function patch(Recipe $recipe, Request $request): Response
    {
        $data = json_decode($request->getContent(), false);

        if (property_exists($data, "image") && is_string($data->image)) {
            $image = $this->fileUploader->uploadBase64($data->image, $data->filename, '/img/recipes/');
            $recipe->setImage($image);
        }

        if (property_exists($data, "removeImage") && is_bool($data->removeImage)) {
            if ($data->removeImage) {
                $recipe->setImage(null);
            }
        }

        $this->recipeRepository->save($recipe, true);
        $this->refreshDataTimestampUtil->updateTimestamp();
        return DTOSerializer::getResponse(new RecipeDTO($recipe));
    }

    #[Route('/{id}', name: 'api_recipes_delete', methods: ['DELETE'])]
    public function delete(Recipe $recipe): Response
    {
        $this->recipeControllerService->removeRecipe($recipe);
        $this->refreshDataTimestampUtil->updateTimestamp();

        return DTOSerializer::getResponse(new RecipeDTO($recipe));
    }
}
