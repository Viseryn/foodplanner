<?php

namespace App\Form;

use App\Entity\Recipe;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\RangeType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RecipeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title')
            ->add('portionSize', RangeType::class, [
                'attr' => [
                    'min' => 1,
                    'max' => 10,
                ],
                'data' => 1,
            ])
            // Add a textarea for the ingredients.
            ->add('ingredients', TextareaType::class, [
                'required' => false,
                'mapped' => false,
            ])
            // Add a textarea for the instructions.
            ->add('instructions', TextareaType::class, [
                'required' => false,
                'mapped' => false,
            ])
            // Add a filetype field for an image.
            ->add('image', FileType::class, [
                'mapped' => false,
                'required'=> false,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Recipe::class,
        ]);
    }
}
