<?php

namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Recipe;
use App\Service\Files\RecipeImageManager;
use Doctrine\ORM\EntityManagerInterface;

readonly class DeleteRecipeImageProcessor implements ProcessorInterface {

    public function __construct(
        private EntityManagerInterface $entityManager,
        private RecipeImageManager $recipeImageManager,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Recipe {
        if (!$data instanceof Recipe) {
            throw new \InvalidArgumentException("Expected instance of Recipe");
        }

        $image = $data->getImage();

        $data->setImage(null);
        $this->recipeImageManager->remove($image);

        $this->entityManager->flush();

        return $data;
    }
}
