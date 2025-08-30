<?php
namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Image;
use App\Entity\Recipe;
use App\Service\Files\RecipeImageManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Exception\ORMException;

readonly class PatchRecipeImageProcessor implements ProcessorInterface {

    public function __construct(
        private EntityManagerInterface $entityManager,
        private RecipeImageManager $recipeImageManager,
        private DeleteRecipeImageProcessor  $deleteRecipeImageProcessor,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Recipe {
        if (!$data instanceof Image) {
            throw new \InvalidArgumentException("Expected instance of Image");
        }

        try {
            /** @var Recipe $recipe */
            $recipe = $this->entityManager->find(Recipe::class, $uriVariables["id"]);
        } catch (\Exception | ORMException) {
            throw new \InvalidArgumentException("Recipe could not be found");
        }

        if ($data->getImageContents() == null) {
            throw new \InvalidArgumentException("Image instance needs to be represented by a base64 string");
        }

        if ($recipe->getImage() != null) {
            $this->deleteRecipeImageProcessor->process($recipe, $operation, $uriVariables, $context);
        }

        $image = $this->recipeImageManager->upload($data);
        $recipe->setImage($image);

        $this->entityManager->flush();

        return $recipe;
    }
}
