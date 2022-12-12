<?php

namespace App\Controller;

use App\Entity\UserGroup;
use App\Repository\UserGroupRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class InstallController extends AbstractController
{
    /**
     * Installation API
     * 
     * @return Response
     */
    #[Route('/api/install', name: 'api_install')]
    public function install(
        UserRepository $userRepository,
        UserGroupRepository $userGroupRepository,
    ): Response {
        // Fetch first User
        $firstUser = $userRepository->find(1);
        if ($firstUser === null) return new Response('Aborted! Please register an account first.');

        // Add admin rights to first user
        $firstUser->setRoles(['ROLE_ADMIN']);
        $userRepository->add($firstUser, true);

        // Add first UserGroup to the database
        $userGroup = new UserGroup();
        $userGroup
            ->setName($firstUser->getUsername())
            ->setStandard(true)
            ->setIcon('face')
            ->addUser($firstUser)
        ;
        $userGroupRepository->add($userGroup, true);

        // Self destruct
        unlink(__FILE__);
        return new Response('Success! You can use FoodPlanner now.');
    }
}
