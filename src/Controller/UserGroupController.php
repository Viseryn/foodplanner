<?php

namespace App\Controller;

use App\Entity\UserGroup;
use App\Form\UserGroupType;
use App\Repository\MealRepository;
use App\Repository\UserGroupRepository;
use App\Service\RefreshDataTimestampUtil;
use App\Service\UserGroupUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use JMS\Serializer\SerializerBuilder;

/**
 * UserGroup API
 */
#[Route('/api/usergroups')]
class UserGroupController extends AbstractController
{
    /**
     * UserGroup List API
     * 
     * Responds with an array of JSON objects matching the type specifications of UserGroupModel.ts.
     *
     * @param UserGroupRepository $userGroupRepository
     * @param UserGroupUtil $userGroupUtil
     * @return JsonResponse
     */
    #[Route('/list', name: 'api_usergroups_list', methods: ['GET'])]
    public function list(
        UserGroupRepository $userGroupRepository, 
        UserGroupUtil $userGroupUtil
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $userGroups = $userGroupRepository->findAll();

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($userGroupUtil->getApiModels($userGroups), 'json');

        return new JsonResponse($jsonContent);
    }

    /**
     * UserGroup Standard API
     * 
     * Updates the standard UserGroup.
     * The request data should be an array of MealCategoryModel JSON objects.
     *
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @param UserGroupUtil $userGroupUtil
     * @return Response
     */
    #[Route('/standard', name: 'api_usergroups_standard', methods: ['GET', 'POST'])]
    public function updateStandard(
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request, 
        UserGroupUtil $userGroupUtil,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $requestContent = json_decode($request->getContent());
        $userGroupUtil->updateStandard($requestContent);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * UserGroups Delete API
     * 
     * Deletes the UserGroup with the given ID and responds with an empty Response.
     *
     * @param MealRepository $mealRepository
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param UserGroup $userGroup
     * @param UserGroupRepository $userGroupRepository
     * @return Response
     */
    #[Route('/delete/{id}', name: 'api_usergroups_delete', methods: ['GET'])]
    public function delete(
        MealRepository $mealRepository,
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        UserGroup $userGroup, 
        UserGroupRepository $userGroupRepository, 
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $meals = $mealRepository->findBy(['userGroup' => $userGroup->getId()]);

        foreach ($meals as $meal) {
            $mealRepository->remove($meal, true);
        }

        $userGroupRepository->remove($userGroup, true);

        $refreshDataTimestampUtil->updateTimestamp();

        return new Response();
    }

    /**
     * UserGroups Add API
     * 
     * Adds a new UserGroup to the database when the form in the Request was submitted. If no form 
     * was submitted, responds with an Error 500.
     *
     * @param RefreshDataTimestampUtil $refreshDataTimestampUtil
     * @param Request $request
     * @param UserGroupRepository $userGroupRepository
     * @return Response
     */
    #[Route('/add', name: 'api_usergroups_add', methods: ['GET', 'POST'])]
    public function add(
        RefreshDataTimestampUtil $refreshDataTimestampUtil,
        Request $request, 
        UserGroupRepository $userGroupRepository,
    ): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $userGroup = new UserGroup();

        // Handle form data and pass to UserGroup object
        $form = $this->createForm(UserGroupType::class, $userGroup);
        $form->handleRequest($request);

        // If form is submitted, add UserGroup to database
        if ($form->isSubmitted()) {
            $userGroupRepository->add($userGroup, true);

            $refreshDataTimestampUtil->updateTimestamp();

            return new Response();
        }

        // Respond with Error 500 if no form is submitted
        $response = (new Response())->setStatusCode(500);
        return $response;
    }
}
