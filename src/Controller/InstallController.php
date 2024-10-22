<?php namespace App\Controller;

use App\Component\Exception\ValidationFailedException;
use App\Component\Response\ExceptionResponseFactory;
use App\DataTransferObject\RegistrationDTO;
use App\Entity\Roles;
use App\Entity\User;
use App\Mapper\UserMapper;
use App\Repository\InstallationStatusRepository;
use App\Service\DtoResponseService;
use App\Service\JsonDeserializer;
use App\Service\RefreshDataTimestampUtil;
use App\Service\RegistrationControllerService;
use App\Validator\RegistrationValidator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class InstallController extends AbstractControllerWithMapper
{
    /** @var UserMapper */ protected $mapper;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly InstallationStatusRepository $installationStatusRepository,
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
        private readonly RegistrationControllerService $registrationControllerService,
        private readonly RegistrationValidator $validator,
        private readonly UserPasswordHasherInterface $userPasswordHasher,
    ) {
        parent::__construct(User::class);
    }

    #[Route('/api/install', name: 'api_install', methods: ['POST'])]
    public function install(Request $request): Response {
        $installationStatus = $this->installationStatusRepository->find(1);
        if ($installationStatus->isStatus()) {
            return (new Response)->setStatusCode(405); // TODO Fehlercode
        }

        $dto = JsonDeserializer::jsonToDto($request->getContent(), RegistrationDTO::class);
        try {
            $this->validator->validateDto($dto);
        } catch (ValidationFailedException $e) {
            return ExceptionResponseFactory::getValidationFailedExceptionResponse($e);
        }

        $user = $this->mapper->registrationDtoToEntity($dto);
        $user->setPassword($this->userPasswordHasher->hashPassword($user, $dto->getPassword()))
             ->setRoles([Roles::ROLE_ADMIN->value, Roles::ROLE_USER_ADMINISTRATION->value])
             ->setActive(true);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $this->registrationControllerService->createUserSettings($user);
        $this->registrationControllerService->createUserGroup($user);
        $this->registrationControllerService->addToEveryoneGroup($user);

        $installationStatus->setStatus(true);
        $this->installationStatusRepository->save($installationStatus, true);

        $this->refreshDataTimestampUtil->updateTimestamp();

        return DtoResponseService::getResponse($this->mapper->entityToDto($user));
    }
}
