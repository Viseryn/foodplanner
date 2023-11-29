<?php

namespace App\Controller;

use App\Entity\UserGroup;
use App\Form\UserGroupType;
use App\Repository\SettingsRepository;
use App\Repository\UserGroupRepository;
use App\Service\DtoResponseService;
use App\Service\RefreshDataTimestampUtil;
use App\Service\UserGroupControllerService;
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
    /** @var UserGroup[] */
    private array $standardUserGroups;

    public function __construct(
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
        private readonly SettingsRepository $settingsRepository,
        private readonly UserGroupControllerService $userGroupControllerService,
        private readonly UserGroupRepository $userGroupRepository,
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

            $userGroup->setHidden($data->hidden);
        }

        $this->userGroupRepository->add($userGroup, true);
        return DtoResponseService::getResponse($this->mapper->entityToDto($userGroup));
    }

    #[Route('', name: 'api_usergroups_post', methods: ['POST'])]
    public function post(Request $request): Response
    {
        $userGroup = new UserGroup();

        $form = $this->createForm(UserGroupType::class, $userGroup); // TODO [Issue #116]
        $form->handleRequest($request);

        if (!$form->isSubmitted()) {
            return (new Response)->setStatusCode(400);
        }

        $userGroup // TODO [Issue #116]
            ->setHidden(false)
            ->setReadonly(false)
            ->setPosition($this->userGroupRepository->getMaxPosition());

        $this->userGroupRepository->add($userGroup, true);
        $this->refreshDataTimestampUtil->updateTimestamp();

        return DtoResponseService::getResponse($this->mapper->entityToDto($userGroup));
    }
}
