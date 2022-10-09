<?php

namespace App\Service;

use App\Entity\Recipe;
use App\Repository\IngredientRepository;
use App\Repository\InstructionRepository;
use App\Repository\RecipeRepository;
use Symfony\Component\Form\FormInterface;

class RecipeUtil 
{
    public function __construct(
        IngredientUtil $ingredientUtil,
        InstructionUtil $instructionUtil,
        FileUploader $fileUploader,
        IngredientRepository $ingredientRepository,
        InstructionRepository $instructionRepository,
        RecipeRepository $recipeRepository,
    ) {
        $this->ingredientUtil = $ingredientUtil;
        $this->instructionUtil = $instructionUtil;
        $this->fileUploader = $fileUploader;
        $this->ingredientRepository = $ingredientRepository;
        $this->instructionRepository = $instructionRepository;
        $this->recipeRepository = $recipeRepository;
    }

    /**
     * Updates image, ingredients and instructions of a Recipe.
     *
     * @param Recipe $recipe
     * @param FormInterface $form
     * @return self
     */
    public function update(Recipe &$recipe, FormInterface $form): self
    {
        $deleteImage = (isset($form['image_remove'])) 
            ? (bool) $form['image_remove']->getData() 
            : false;
        
        $this
            ->updateImage($recipe, $form['image']->getData(), $deleteImage)
            ->updateIngredients($recipe, $form['ingredients']->getData())
            ->updateInstructions($recipe, $form['instructions']->getData())
        ;

        return $this;
    }

    /**
     * Updates the image of a Recipe.
     *
     * @param Recipe $recipe
     * @param mixed $image An image file, e.g. through a form.
     * @param boolean $deleteImage False by default.
     * @return self
     */
    public function updateImage(Recipe &$recipe, mixed $image, bool $deleteImage = false): self 
    {
        if (! $deleteImage) {
            if ($image && $this->fileUploader->isImage($image->getClientOriginalName())) {
                $imageFile = $this->fileUploader->upload($image, '/img/recipes/');
                $recipe->setImage($imageFile);
            }
        } else {
            $recipe->setImage(null);
        }

        $this->recipeRepository->add($recipe, true);

        return $this;
    }

    /**
     * Updates the ingredients of a Recipe if there was a change.
     *
     * @param Recipe $recipe
     * @param string $new A string of ingredients, e.g. through a form.
     * @return self
     */
    public function updateIngredients(Recipe &$recipe, ?string $newIngredients): self
    {
        $old = $recipe->getIngredients();
        $oldString = $this->ingredientUtil->ingredientString($old);

        if ($newIngredients !== $oldString) {
            foreach ($old as $ing) {
                $this->ingredientRepository->remove($ing, true);
            }

            $newArray = $this->ingredientUtil->ingredientSplit($newIngredients);

            foreach ($newArray as $ing) {
                $ing->setRecipe($recipe);
                $this->ingredientRepository->add($ing, true);
            }
        }

        return $this;
    }

    /**
     * Updates the instructions of a Recipe if there was a change.
     *
     * @param Recipe $recipe
     * @param string $newInstructions A string of instructions, e.g. through a form.
     * @return self
     */
    public function updateInstructions(Recipe &$recipe, ?string $newInstructions): self
    {
        $old = $recipe->getInstructions();
        $oldString = $this->instructionUtil->instructionString($old);

        if ($newInstructions !== $oldString) {
            foreach ($old as $inst) {
                $this->instructionRepository->remove($inst, true);
            }

            $newArray = $this->instructionUtil->instructionSplit($newInstructions);

            foreach ($newArray as $inst) {
                $inst->setRecipe($recipe);
                $this->instructionRepository->add($inst, true);
            }
        }

        return $this;
    }
}
