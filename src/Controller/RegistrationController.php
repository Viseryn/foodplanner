<?php namespace App\Controller;

use App\DataTransferObject\UserDTO;
use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Service\DtoResponseService;
use App\Service\RefreshDataTimestampUtil;
use App\Service\RegistrationControllerService;
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
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
        private readonly RegistrationControllerService $registrationControllerService,
        private readonly UserPasswordHasherInterface $userPasswordHasher,
    ) {}

    /**
     * Registers a new user, creates their settings and responds with the User object.
     */
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $user->setPassword(
                $this->userPasswordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            $this->registrationControllerService->createUserSettings($user);
            $this->refreshDataTimestampUtil->updateTimestamp();
        }
        
        return DtoResponseService::getResponse(new UserDTO($user));
    }
}
