<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserGroup;
use App\Form\RegistrationFormType;
use App\Repository\InstallationStatusRepository;
use App\Repository\UserGroupRepository;
use App\Repository\UserRepository;
use App\Service\RegistrationControllerService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * InstallController
 */
class InstallController extends AbstractController
{
    /**
     * Installation API
     *
     * This procedure will automatically open after setting up the app.
     * 1) Will create the first User and UserGroup
     * 2) Will create the Settings for the first user
     * 3) Will set the installationStatus to true
     * Redirects to the app after finishing.
     */
    #[Route('/install', name: 'api_install')]
    public function install(
        EntityManagerInterface $entityManager,
        InstallationStatusRepository $installationStatusRepository,
        RegistrationControllerService $registrationControllerService,
        Request $request,
        UserPasswordHasherInterface $userPasswordHasher,
        UserRepository $userRepository,
        UserGroupRepository $userGroupRepository,
    ): Response {
        $installationStatus = $installationStatusRepository->find(1);
        if ($installationStatus->isStatus()) {
            return $this->redirectToRoute('app_default');
        }

        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData(),
                ),
            );

            $entityManager->persist($user);
            $entityManager->flush();

            $registrationControllerService->createUserSettings($user);

            // Add admin rights to first user
            $user->setRoles(['ROLE_ADMIN']);
            $userRepository->add($user, true);

            // Add first UserGroup to the database
            $userGroup = new UserGroup();
            $userGroup
                ->setName($user->getUsername())
                ->setIcon('face')
                ->addUser($user);
            $userGroupRepository->add($userGroup, true);

            $entityManager->persist($user);
            $entityManager->flush();

            $installationStatus->setStatus(true);
            $installationStatusRepository->save($installationStatus, true);

            return $this->redirectToRoute('app_default');
        }

        return $this->render('install/index.html.twig');
    }
}
