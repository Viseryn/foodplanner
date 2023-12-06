<?php namespace App\Controller;

use App\Component\Exception\ValidationFailedException;
use App\Component\Response\ExceptionResponseFactory;
use App\DataTransferObject\RegistrationDTO;
use App\Entity\User;
use App\Mapper\UserMapper;
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

class RegistrationController extends AbstractControllerWithMapper
{
    /** @var UserMapper */ protected $mapper;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
        private readonly RegistrationControllerService $registrationControllerService,
        private readonly RegistrationValidator $validator,
        private readonly UserPasswordHasherInterface $userPasswordHasher,
    ) {
        parent::__construct(User::class);
    }

    /**
     * Creates a User object, corresponding Settings and UserGroup objects and adds the
     * user to the common UserGroup. Responds with the newly created User object.
     */
    #[Route('/api/register', name: 'api_users_post', methods: ['POST'])]
    public function register(Request $request): Response
    {
        $dto = JsonDeserializer::jsonToDto($request->getContent(), RegistrationDTO::class);

        try {
            $this->validator->validateDto($dto);
        } catch (ValidationFailedException $e) {
            return ExceptionResponseFactory::getValidationFailedExceptionResponse($e);
        }

        $user = $this->mapper->registrationDtoToEntity($dto);
        $user->setPassword($this->userPasswordHasher->hashPassword($user, $dto->getPassword()));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $this->registrationControllerService->createUserSettings($user);
        $this->registrationControllerService->createUserGroup($user);
        $this->registrationControllerService->addToEveryoneGroup($user);

        $this->refreshDataTimestampUtil->updateTimestamp();

        return DtoResponseService::getResponse($this->mapper->entityToDto($user));
    }
}
