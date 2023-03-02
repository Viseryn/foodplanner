<?php

namespace App\Controller;

use App\Entity\Settings;
use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Repository\SettingsRepository;
use App\Service\RefreshDataTimestampUtil;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Registration API
 */
class RegistrationController extends AbstractController
{
    /**
     * Registration Register API
     *
     * @param EntityManagerInterface $entityManager
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @param SettingsRepository $settingsRepository
     * @param UserPasswordHasherInterface $userPasswordHasher
     * @return Response
     */
    #[Route('/api/register', name: 'api_register')]
    public function register(
        EntityManagerInterface $entityManager, 
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request, 
        SettingsRepository $settingsRepository,
        UserPasswordHasherInterface $userPasswordHasher,
    ): Response {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            // encode the plain password
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );

            $entityManager->persist($user);
            $entityManager->flush();
            
            // Add user specific settings
            $settings = new Settings();
            $settings
                ->setUser($user)
                ->setShowPantry(true)
            ;
            $settingsRepository->save($settings, true);

            $refreshDataTimestampUtil->updateTimestamp();
        }
        
        return new Response();
    }
}
