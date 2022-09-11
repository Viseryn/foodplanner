<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

use App\Entity\Ingredient;
use App\Entity\QuantifiedIngredient;
use App\Entity\Recipe;
use App\Entity\Storage;

class RecipeFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {

        $hack = (new Ingredient())->setName('Hackfleisch (gemischt)');
        $sahne = (new Ingredient())->setName('Schlagsahne');
        $nudeln = (new Ingredient())->setName('Bandnudeln');
        $sauce = (new Ingredient())->setName('Tomatensauce');
        $gouda = (new Ingredient())->setName('Gouda (Stück)');
        $schmelz = (new Ingredient())->setName('Sahne-Schmelzkäse');

        $manager->persist($hack);
        $manager->persist($sahne);
        $manager->persist($nudeln);
        $manager->persist($sauce);
        $manager->persist($gouda);
        $manager->persist($schmelz);
        
        $qhack = (new QuantifiedIngredient())->setIngredient($hack)->setQuantityValue(400)->setQuantityUnit('g');
        $qhackSt = (new QuantifiedIngredient())->setIngredient($hack)->setQuantityValue(400)->setQuantityUnit('g');
        $qsahne = (new QuantifiedIngredient())->setIngredient($sahne)->setQuantityValue(200)->setQuantityUnit('g');
        $qnudeln = (new QuantifiedIngredient())->setIngredient($nudeln)->setQuantityValue(250)->setQuantityUnit('g');
        $qsauce = (new QuantifiedIngredient())->setIngredient($sauce)->setQuantityValue(1)->setQuantityUnit('Glas');
        $qgouda = (new QuantifiedIngredient())->setIngredient($gouda)->setQuantityValue(225)->setQuantityUnit('g');
        $qschmelz = (new QuantifiedIngredient())->setIngredient($schmelz)->setQuantityValue(100)->setQuantityUnit('g');

        $manager->persist($qhack);
        $manager->persist($qhackSt);
        $manager->persist($qsahne);
        $manager->persist($qnudeln);
        $manager->persist($qsauce);
        $manager->persist($qgouda);
        $manager->persist($qschmelz);

        $recipe = (new Recipe())
            ->setTitle('Lasaschne')
            ->setPortionSize(2)
            ->setInstructionList([
                'Den Ofen auf 180°C (Umluft) vorheizen.',
                'Nudeln kochen und Hackfleisch anbraten. Hackfleisch mit Grillgewürz, Salz und Pfeffer würzen.',
                'Sahne und Schmelzkäse in einem Topf auf niedriger Stufe erwärmen, bis der Käse geschmolzen ist. Mit Muskat, Salz und Pfeffer würzen.',
                'Währenddessen den Gouda reiben.',
                'Tomatensauce zum Hackfleisch dazugeben und kurz leicht köcheln lassen.',
                'Nudeln abgießen und in die Auflaufform geben. Gut mit der Tomaten-Hack-Sauce vermischen und Sahnesauce dazu geben. Zuletzt mit Käse bestreuen.',
                'Im Ofen 20min mit Alufolie und 15min ohne Alufolie backen lassen.',
            ])
            ->addIngredientList($qhack)
            ->addIngredientList($qsahne)
            ->addIngredientList($qnudeln)
            ->addIngredientList($qsauce)
            ->addIngredientList($qgouda)
            ->addIngredientList($qschmelz);
        
        $manager->persist($recipe);

        $storage = (new Storage())->setName('storage')->addIngredientList($qhackSt);
        $shoppingList = (new Storage())->setName('shoppinglist');

        $manager->persist($storage);
        $manager->persist($shoppingList);

        $manager->flush();
    }
}
