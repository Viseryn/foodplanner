<?php

namespace App\Form;

use App\Entity\File;
use App\Entity\Recipe;
use App\Repository\FileRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class RecipeType extends AbstractType
{

    public function __construct(FileRepository $fileRepository)
    {
        $this->fileRepository = $fileRepository;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title')
            ->add('portionSize')
            // Add all File objects that are images.
            // The last two options allow for null as choice.
            ->add('image', EntityType::class, [
                'class' => File::class,
                'choices' => $this->fileRepository->findAllImages(),
                'required' => false,
                'empty_data' => '',
            ])
            // Add a textarea for the instructions.
            ->add('instructions', TextareaType::class, [
                'required' => false,
                'mapped' => false,
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
