<?php

namespace App\Controller;

use App\Entity\UserGroup;
use App\Form\UserGroupType;
use App\Repository\UserGroupRepository;
use App\Service\DtoResponseService;
use App\Service\RefreshDataTimestampUtil;
use App\Service\UserGroupControllerService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * UserGroup API
 */
#[Route('/api/usergroups')]
class UserGroupController extends AbstractControllerWithMapper
{
    public function __construct(
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
        private readonly UserGroupControllerService $userGroupControllerService,
        private readonly UserGroupRepository $userGroupRepository,
    ) {
        parent::__construct(UserGroup::class);
    }

    #[Route('', name: 'api_usergroups_get', methods: ['GET'])]
    public function get(): Response
    {
        $userGroupDTOs = $this->userGroupControllerService->getAllUserGroups();
        return DtoResponseService::getResponse($userGroupDTOs);
    }

    #[Route('/{id}', name: 'api_usergroups_delete', methods: ['DELETE'])]
    public function delete(UserGroup $userGroup): Response
    {
        $this->userGroupControllerService->removeUserGroup($userGroup);
        $this->refreshDataTimestampUtil->updateTimestamp();
        return (new Response)->setStatusCode(204);
    }

    #[Route('', name: 'api_usergroups_post', methods: ['POST'])]
    public function post(Request $request): Response
    {
        $userGroup = new UserGroup();

        $form = $this->createForm(UserGroupType::class, $userGroup);
        $form->handleRequest($request);

        if (!$form->isSubmitted()) {
            return (new Response)->setStatusCode(400);
        }

        $this->userGroupRepository->add($userGroup, true);
        $this->refreshDataTimestampUtil->updateTimestamp();

        return DtoResponseService::getResponse($this->mapper->entityToDto($userGroup));
    }
}
