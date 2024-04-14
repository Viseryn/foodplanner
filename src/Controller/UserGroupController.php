<?php

namespace App\Controller;

use App\Component\Exception\ValidationFailedException;
use App\Component\Response\ExceptionResponseFactory;
use App\DataTransferObject\UserGroupDTO;
use App\Entity\User;
use App\Entity\UserGroup;
use App\Mapper\UserGroupMapper;
use App\Repository\SettingsRepository;
use App\Repository\UserGroupRepository;
use App\Repository\UserRepository;
use App\Service\DtoResponseService;
use App\Service\JsonDeserializer;
use App\Service\RefreshDataTimestampUtil;
use App\Service\UserGroupControllerService;
use App\Validator\UserGroupValidator;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Annotation\Route;

/**
 * UserGroup API
 */
#[Route('/api/usergroups')]
class UserGroupController extends AbstractControllerWithMapper
{
    /** @var UserGroupMapper */
    protected $mapper;

    /** @var UserGroup[] */
    private array $standardUserGroups;

    public function __construct(
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
        private readonly SettingsRepository $settingsRepository,
        private readonly UserGroupControllerService $userGroupControllerService,
        private readonly UserGroupRepository $userGroupRepository,
        private readonly UserRepository $userRepository,
        private readonly UserGroupValidator $validator,
    ) {
        parent::__construct(UserGroup::class);

        $this->standardUserGroups = array_map(
            fn ($setting): ?UserGroup => $setting->getStandardUserGroup(),
            $this->settingsRepository->findAll()
        );
    }

    #[Route('', name: 'api_usergroups_get', methods: ['GET'])]
    public function get(#[MapQueryParameter] ?bool $hidden): Response
    {
        $userGroupDTOs = match ($hidden) {
            null => $this->userGroupControllerService->getAllUserGroups(),
            true, false => $this->userGroupControllerService->getAllUserGroupsByHidden($hidden),
        };
        return DtoResponseService::getResponse($userGroupDTOs);
    }

    #[Route('/{id}', name: 'api_usergroups_delete', methods: ['DELETE'])]
    public function delete(UserGroup $userGroup): Response
    {
        if ($userGroup->isReadonly()) {
            return new Response("UserGroup cannot be deleted because it is readonly.", 405);
        }

        if (in_array($userGroup, $this->standardUserGroups)) {
            return new Response("UserGroup cannot be deleted because a user set it as their standard group.", 405);
        }

        $this->userGroupControllerService->removeUserGroup($userGroup);
        $this->refreshDataTimestampUtil->updateTimestamp();
        return (new Response)->setStatusCode(204);
    }

    #[Route('/{id}', name: 'api_usergroups_patch', methods: ['PATCH'])]
    public function patch(Request $request, UserGroup $userGroup): Response
    {
        $data = json_decode($request->getContent(), false);

        if (property_exists($data, "hidden") && is_bool($data->hidden)) {
            if (in_array($userGroup, $this->standardUserGroups)) {
                return new Response("UserGroup cannot be hidden because a user set it as their standard group.", 405);
            }

            if ($data->hidden && count($this->userGroupRepository->findBy(['hidden' => false])) == 1) {
                return new Response("UserGroup cannot be hidden because at least one group must be visible.", 405);
            }

            $userGroup->setHidden($data->hidden);
        }

        if (property_exists($data, "position") && is_int($data->position)) {
            $userGroup->setPosition($data->position);
        }

        if (property_exists($data, "name") && is_string($data->name)) {
            $userGroup->setName($data->name);
        }

        if (property_exists($data, "icon") && is_string($data->icon)) {
            $userGroup->setIcon($data->icon);
        }

        if (property_exists($data, "users")) {
            $users = JsonDeserializer::jsonArrayToEntities(json_encode($data->users), User::class)
                                     ->map(fn ($user) => $this->userRepository->findOneBy(["username" => $user->getUsername()]));

            $userGroup->setUsers(new ArrayCollection);
            foreach ($users as $user) {
                $userGroup->addUser($user);
            }
        }

        $this->userGroupRepository->add($userGroup, true);
        return DtoResponseService::getResponse($this->mapper->entityToDto($userGroup));
    }

    #[Route('', name: 'api_usergroups_post', methods: ['POST'])]
    public function post(Request $request): Response
    {
        $userGroupDto = JsonDeserializer::jsonToDto($request->getContent(), UserGroupDTO::class);

        try {
            $this->validator->validateDto($userGroupDto);
        } catch (ValidationFailedException $e) {
            return ExceptionResponseFactory::getValidationFailedExceptionResponse($e);
        }

        $userGroup = $this->mapper->dtoToEntityWithUsers($userGroupDto, $this->userRepository);
        $userGroup->setPosition($this->userGroupRepository->getMaxPosition());

        $this->userGroupRepository->add($userGroup, true);
        $this->refreshDataTimestampUtil->updateTimestamp();

        return DtoResponseService::getResponse($this->mapper->entityToDto($userGroup));
    }
}
