<?php

namespace App\Controller;

use App\Repository\UserGroupRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use JMS\Serializer\SerializerBuilder;
use Symfony\Component\HttpFoundation\Request as Request;
use Symfony\Component\HttpFoundation\Response;

class UserGroupController extends AbstractController
{
    /**
     * UserGroup API
     * 
     * Responds with an array of UserGroups.
     *
     * @param UserGroupRepository $userGroupRepository
     * @return JsonResponse
     */
    #[Route('/api/usergroups', name: 'app_api_usergroups', methods: ['GET'])]
    public function userGroupsAPI(UserGroupRepository $userGroupRepository): JsonResponse
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_USER');

        // Fetch all UserGroup objects from the database
        $userGroups = $userGroupRepository->findAll();

        // Create array for response
        $userGroupsResponse = [];

        // Add public data to the response array
        foreach ($userGroups as $userGroup) {
            $userGroupsResponse[] = [
                'id' => $userGroup->getId(),
                'name' => $userGroup->getName(),
                'users' => [],
                'isStandard' => $userGroup->isStandard(),
                'icon' => $userGroup->getIcon(),
            ];

            // Only add the usernames to the response, not the rest of the user data
            foreach ($userGroup->getUsers() as $user) {
                array_push(
                    $userGroupsResponse[count($userGroupsResponse) - 1]['users'],
                    $user->getUsername()
                );
            }
        }

        // Serialize data and respond
        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($userGroupsResponse, 'json');

        return new JsonResponse($jsonContent);
    }

    /**
     * UserGroups Update Standard API
     * 
     * Updates the standard value 
     *
     * @param Request $request
     * @param UserGroupRepository $userGroupRepository
     * @return Response
     */
    #[Route('/api/usergroups/update-standard', name: 'app_api_usergroups_update_standard', methods: ['GET', 'POST'])]
    public function updateStandard(Request $request, UserGroupRepository $userGroupRepository): Response 
    {
        // Fetch request content
        $requestContent = json_decode($request->getContent());

        // Update each UserGroup in the database according to the request array
        foreach ($requestContent as $group) {
            // Set this to true when standard is set, so there is only one standard group
            $setStandard = false;

            // Get UserGroup from db
            $groupDb = $userGroupRepository->find($group->id);
            
            if ($group->isStandard && !$setStandard) {
                $groupDb->setStandard(true);
                $setStandard = true;
            } else {
                $groupDb->setStandard(false);
            }

            // Update group in database
            $userGroupRepository->add($groupDb, true);
        }

        // Empty response
        return new Response();
    }
}
