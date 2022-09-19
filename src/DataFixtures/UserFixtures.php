<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

use App\Entity\User;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $user = (new User())
            ->setUsername('Kevin')
            ->setPassword('$2y$13$nIqjI0VuGZI1VzNHnZpmZeltodLvH/0msUxBwj0mxXb/k6XCwENp2');
        $manager->persist($user);
        $manager->flush();
    }
}
