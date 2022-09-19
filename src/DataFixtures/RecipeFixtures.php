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
        $hack = (new QuantifiedIngredient())->setName("Hackfleisch (gemischt)")->setQuantityValue(400)->setQuantityUnit('g');
        $hackSt = (new QuantifiedIngredient())->setName("Hackfleisch (gemischt)")->setQuantityValue(400)->setQuantityUnit('g');
        $sahne = (new QuantifiedIngredient())->setName("Schlagsahne")->setQuantityValue(200)->setQuantityUnit('g');
        $nudeln = (new QuantifiedIngredient())->setName("Bandnudeln")->setQuantityValue(250)->setQuantityUnit('g');
        $sauce = (new QuantifiedIngredient())->setName("Tomatensauce")->setQuantityValue(1)->setQuantityUnit('Glas');
        $gouda = (new QuantifiedIngredient())->setName("Gouda (Stück)")->setQuantityValue(225)->setQuantityUnit('g');
        $schmelz = (new QuantifiedIngredient())->setName("Sahne-Schmelzkäse")->setQuantityValue(100)->setQuantityUnit('g');

        $manager->persist($hack);
        $manager->persist($hackSt);
        $manager->persist($sahne);
        $manager->persist($nudeln);
        $manager->persist($sauce);
        $manager->persist($gouda);
        $manager->persist($schmelz);

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
            ->addIngredientList($hack)
            ->addIngredientList($sahne)
            ->addIngredientList($nudeln)
            ->addIngredientList($sauce)
            ->addIngredientList($gouda)
            ->addIngredientList($schmelz);
        
        $manager->persist($recipe);

        $storage = (new Storage())->setName('storage')->addIngredientList($hackSt);
        $shoppingList = (new Storage())->setName('shoppinglist');

        $manager->persist($storage);
        $manager->persist($shoppingList);

        $manager->flush();
    }
}
