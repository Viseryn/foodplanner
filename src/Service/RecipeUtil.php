<?php

namespace App\Service;

use App\Entity\Recipe;
use App\Repository\IngredientRepository;
use App\Repository\InstructionRepository;
use App\Repository\RecipeRepository;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormInterface;

/**
 * RecipeUtil
 * 
 * A utility class for Recipe objects.
 * 
 * @method RecipeUtil update(Recipe &$recipe, FormInterface $form)
 * @method
 */
class RecipeUtil 
{
    private IngredientUtil $ingredientUtil;
    private InstructionUtil $instructionUtil;
    private FileUploader $fileUploader;
    private IngredientRepository $ingredientRepository;
    private InstructionRepository $instructionRepository;
    private RecipeRepository $recipeRepository;

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
     * update
     * 
     * Updates image, ingredients and instructions of a Recipe object
     * through a given FormInterface that belongs to a form that was 
     * submitted.
     *
     * @param Recipe $recipe
     * @param FormInterface $form
     * @return self
     */
    public function update(Recipe &$recipe, FormInterface $form): self
    {
        // In the EditRecipe.js form, the user can decide whether to 
        // delete the current image. If they decide to do so, the 
        // updateImage() method needs the third parameter set to true.
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
     * updateImage
     * 
     * Updates the image of a Recipe object.
     *
     * @param Recipe $recipe
     * @param mixed $image An image file, e.g. through a form.
     * @param boolean $deleteImage Whether the image of the Recipe should be deleted. Default is false.
     * @return self
     */
    private function updateImage(Recipe &$recipe, mixed $image, bool $deleteImage = false): self 
    {
        if (!$deleteImage) {
            if ($image && $this->fileUploader->isImage($image->getClientOriginalName())) {
                $imageFile = $this->fileUploader->upload($image, '/img/recipes/');
                $recipe->setImage($imageFile);
            }
        } else {
            $recipe->setImage(null);
        }

        $this->recipeRepository->save($recipe, true);

        return $this;
    }

    /**
     * updateIngredients
     * 
     * Updates the Ingredient objects of a Recipe object if a 
     * change was detected.
     *
     * @param Recipe $recipe
     * @param string $new A string of ingredients, e.g. through a form.
     * @return self
     */
    private function updateIngredients(Recipe &$recipe, ?string $newIngredients): self
    {
        // Turn current Ingredient objects into an array of strings
        $currentIngredients = $recipe->getIngredients();
        $currentIngredientStrings = $this->ingredientUtil
            ->transformObjectArrayToStringArray($currentIngredients);
        
        // Split string after newlines
        $newIngredientStrings = preg_split('/\r\n|\r|\n/', $newIngredients);

        // Remove all empty elements from the array
        $newIngredientStrings = array_filter($newIngredientStrings);

        if ($currentIngredientStrings !== $newIngredientStrings) {
            foreach ($currentIngredients as $ingredient) {
                $this->ingredientRepository->remove($ingredient, true);
            }

            $newIngredients = $this->ingredientUtil
                ->transformStringArrayToObjectArray($newIngredientStrings);
            
            foreach ($newIngredients as $ingredient) {
                $ingredient->setRecipe($recipe);
                $this->ingredientRepository->save($ingredient, true);
            }
        }

        return $this;
    }

    /**
     * updateInstructions
     * 
     * Updates the Instruction objects of a Recipe object if a 
     * change was detected.
     *
     * @param Recipe $recipe
     * @param string $newInstructions A string of instructions, e.g. through a form.
     * @return self
     */
    private function updateInstructions(Recipe &$recipe, ?string $newInstructions): self
    {
        // Turn current Instruction objects into an array of strings
        $currentInstructions = $recipe->getInstructions();
        $currentInstructionStrings = $this->instructionUtil
            ->transformObjectArrayToStringArray($currentInstructions);
        
        // Split string after newlines
        $newInstructionStrings = preg_split('/\r\n|\r|\n/', $newInstructions);

        // Remove all empty elements from the array
        $newInstructionStrings = array_filter($newInstructionStrings);

        if ($currentInstructionStrings !== $newInstructionStrings) {
            foreach ($currentInstructions as $instruction) {
                $this->instructionRepository->remove($instruction, true);
            }

            $newInstructions = $this->instructionUtil
                ->transformStringArrayToObjectArray($newInstructionStrings);
            
            foreach ($newInstructions as $instruction) {
                $instruction->setRecipe($recipe);
                $this->instructionRepository->save($instruction, true);
            }
        }

        return $this;
    }

    /**
     * prepareEditForm
     * 
     * Sets the default data for the FormInterface
     * in the Recipe Edit API.
     *
     * @param Recipe $recipe
     * @param FormInterface $form
     * @return FormInterface
     */
    public function prepareEditForm(Recipe &$recipe, FormInterface &$form): FormInterface
    {
        $ingredients = $this->ingredientUtil->transformObjectArrayToStringArray(
            $recipe->getIngredients()
        );

        $instructions = $this->instructionUtil->transformObjectArrayToStringArray(
            $recipe->getInstructions()
        );

        $ingredientsValue = implode("\r\n", $ingredients);
        $instructionsValue = implode("\r\n\r\n", $instructions);

        $form
            ->add('ingredients', TextareaType::class, [
                'required' => false,
                'mapped' => false,
                'data' => $ingredientsValue,
            ])
            ->add('instructions', TextareaType::class, [
                'required' => false,
                'mapped' => false,
                'data' => $instructionsValue,
            ])
            ->add('image_remove', CheckboxType::class, [
                'required' => false,
                'mapped' => false,
            ])
        ;

        return $form;
    }
}
