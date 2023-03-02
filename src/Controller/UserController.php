<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\UserUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use JMS\Serializer\SerializerBuilder;

/**
 * User API
 */
#[Route('/api/user')]
class UserController extends AbstractController
{
    /**
     * User Detail API
     * 
     * Responds with a JSON object matching the type specifications of UserModel.ts.
     *
     * @return Response
     */
    #[Route('/detail', name: 'api_user_detail')]
    public function detail(UserUtil $userUtil): Response
    {
        // For the User object we need a little workaround, since $this->getUser() returns a 
        // UserInterface and not a User object (which is what we need). Hence, we use this little 
        // helper function to cast the result of $this->getUser() to a User object. If the former 
        // is null, we just return an empty User object. (In fact, it will have the ROLE_USER role,
        // but a user needs ROLE_ADMIN to access anything.)
        $castToUser = function(null|UserInterface|User $userParam): User {
            return $userParam ?: new User;
        };

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($userUtil->getApiModel($castToUser($this->getUser())), 'json');

        return new JsonResponse($jsonContent);
    }

    /**
     * User List API
     * 
     * Responds with an array of JSON object matching the type specifications of UserGroupModel.ts.
     */
    #[Route('/list', name: 'api_user_list')]
    public function users(UserRepository $userRepository, UserUtil $userUtil): Response
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $users = $userRepository->findAll();

        $serializer = SerializerBuilder::create()->build();
        $jsonContent = $serializer->serialize($userUtil->getApiModels($users), 'json');

        return new JsonResponse($jsonContent);
    }
}
