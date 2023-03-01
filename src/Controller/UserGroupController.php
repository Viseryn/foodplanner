<?php

namespace App\Controller;

use App\Entity\UserGroup;
use App\Form\UserGroupType;
use App\Repository\MealRepository;
use App\Repository\UserGroupRepository;
use App\Service\UserGroupUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use JMS\Serializer\SerializerBuilder;

#[Route('/api/usergroups')]
class UserGroupController extends AbstractController
{
    /**
     * UserGroups List API
     * 
     * Responds with an array of UserGroups.
     *
     * @param UserGroupRepository $userGroupRepository
     * @return JsonResponse
     */
    #[Route('/list', name: 'api_usergroups_list', methods: ['GET'])]
    public function userGroupsAPI(UserGroupRepository $userGroupRepository, UserGroupUtil $userGroupUtil): JsonResponse
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Fetch all UserGroup objects from the database
        $userGroups = $userGroupRepository->findAll();
        $preparedUserGroups = $userGroupUtil->getApiModels($userGroups);

        // Serialize data and respond
        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($preparedUserGroups, 'json');

        return new JsonResponse($jsonContent);
    }

    /**
     * UserGroups Standard API
     * 
     * Updates the standard UserGroup.
     *
     * @param Request $request
     * @param UserGroupRepository $userGroupRepository
     * @return Response
     */
    #[Route('/standard', name: 'api_usergroups_standard', methods: ['GET', 'POST'])]
    public function updateStandard(Request $request, UserGroupRepository $userGroupRepository): Response 
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Fetch request content
        $requestContent = json_decode($request->getContent());

        // Update each UserGroup in the database according to the request array
        foreach ($requestContent as $group) {
            // Set this to true when standard is set, so there is only one standard group
            $setStandard = false;

            // Get UserGroup from db
            $groupDb = $userGroupRepository->find($group->id);
            
            if ($group->standard && !$setStandard) {
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
     * UserGroups Delete API
     * 
     * Deletes the UserGroup with the given ID and responds
     * with an empty Response.
     *
     * @param UserGroup $userGroup
     * @param UserGroupRepository $userGroupRepository
     * @param MealRepository $mealRepository
     * @return Response
     */
    #[Route('/delete/{id}', name: 'api_usergroups_delete', methods: ['GET'])]
    public function delete(UserGroup $userGroup, UserGroupRepository $userGroupRepository, MealRepository $mealRepository): Response
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

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
     * UserGroups Add API
     * 
     * Adds a new UserGroup to the database when the form 
     * in the Request was submitted. If no form was submitted, 
     * responds with an Error 500.
     *
     * @param Request $request
     * @param UserGroupRepository $userGroupRepository
     * @return Response
     */
    #[Route('/add', name: 'api_usergroups_add', methods: ['GET', 'POST'])]
    public function add(Request $request, UserGroupRepository $userGroupRepository): Response 
    {
        // Deny access if not logged in
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Create empty UserGroup object
        $userGroup = new UserGroup();

        // Handle form data and pass to UserGroup object
        $form = $this->createForm(UserGroupType::class, $userGroup);
        $form->handleRequest($request);

        // If form is submitted, add UserGroup to database
        if ($form->isSubmitted()) {
            $userGroupRepository->add($userGroup, true);

            return new Response();
        }

        // Respond with Error 500 if no form is submitted
        $response = (new Response())->setStatusCode(500);
        return $response;
    }
}
