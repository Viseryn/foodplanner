<?php

namespace App\Controller;

use App\Repository\UserGroupRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use JMS\Serializer\SerializerBuilder;

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
}
