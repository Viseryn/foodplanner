<?php

namespace App\Controller;

use App\Entity\UserGroup;
use App\Repository\MealRepository;
use App\Repository\UserGroupRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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
                'name' => $userGroup->getName(),
                'users' => [],
                'isStandard' => $userGroup->isStandard(),
                'icon' => $userGroup->getIcon(),
                'id' => 'userGroup_' . $userGroup->getName(),           // For radio buttons
                'value' => $userGroup->getId(),                         // For radio buttons
                'label' => $userGroup->getName(),                       // For radio buttons
                'checked' => $userGroup->isStandard() ? 'checked' : '', // For radio buttons
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
     * Updates the standard UserGroup.
     *
     * @param Request $request
     * @param UserGroupRepository $userGroupRepository
     * @return Response
     */
    #[Route('/api/usergroups/update-standard', name: 'app_api_usergroups_update_standard', methods: ['GET', 'POST'])]
    public function updateStandard(Request $request, UserGroupRepository $userGroupRepository): Response 
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_USER');

        // Fetch request content
        $requestContent = json_decode($request->getContent());

        // Update each UserGroup in the database according to the request array
        foreach ($requestContent as $group) {
            // Set this to true when standard is set, so there is only one standard group
            $setStandard = false;

            // Get UserGroup from db
            $groupDb = $userGroupRepository->find($group->value);
            
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

    /**
     * UserGroup Delete API
     * 
     * Deletes the UserGroup with the given ID and responds
     * with an empty Response.
     *
     * @param UserGroup $userGroup
     * @param UserGroupRepository $userGroupRepository
     * @param MealRepository $mealRepository
     * @return Response
     */
    #[Route('/api/usergroups/delete/{id}', name: 'app_api_usergroups_delete', methods: ['GET'])]
    public function delete(UserGroup $userGroup, UserGroupRepository $userGroupRepository, MealRepository $mealRepository): Response
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_USER');

        // Get all meals for that UserGroup
        $meals = $mealRepository->findBy(['userGroup' => $userGroup->getId()]);

        // Delete all meals first
        foreach ($meals as $meal) {
            $mealRepository->remove($meal, true);
        }

        // Delete UserGroup
        $userGroupRepository->remove($userGroup, true);

        return new Response();
    }


    /**
     * UserGroup Add API
     */
    #[Route('/api/usergroups/add', name: 'app_api_usergroups_add', methods: ['GET', 'POST'])]
    public function add(Request $request): Response 
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_USER');

        $userGroup = new UserGroup();

        $form = $this->createForm(UserGroupType::class, $userGroup);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            // Add UserGroup to database
            $userGroupRepository->add($userGroup, true);

            return new Response();
        }

        // Respond with Error 500 if no form is submitted
        $response = (new Response())->setStatusCode(500);
        return $response;
    }
}
