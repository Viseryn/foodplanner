<?php

namespace App\Controller;

use App\DataTransferObject\UserGroupDTO;
use App\Entity\UserGroup;
use App\Form\UserGroupType;
use App\Repository\UserGroupRepository;
use App\Service\DTOSerializer;
use App\Service\RefreshDataTimestampUtil;
use App\Service\UserGroupControllerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * UserGroup API
 */
#[Route('/api/usergroups')]
class UserGroupController extends AbstractController
{
    public function __construct(
        private RefreshDataTimestampUtil $refreshDataTimestampUtil,
        private UserGroupControllerService $userGroupControllerService,
        private UserGroupRepository $userGroupRepository,
    ) {}

    #[Route('', name: 'api_usergroups_get', methods: ['GET'])]
    public function get(): Response
    {
        $userGroupDTOs = $this->userGroupControllerService->getAllUserGroups();
        return DTOSerializer::getResponse($userGroupDTOs);
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

        return DTOSerializer::getResponse(new UserGroupDTO($userGroup));
    }
}
