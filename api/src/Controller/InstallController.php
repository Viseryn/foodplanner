<?php

namespace App\Controller;

use App\Entity\InstallationStatus;
use App\Entity\Role;
use App\Repository\UserRepository;
use App\Service\RefreshDataTimestampUtil;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class InstallController extends AbstractController {
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
        private readonly UserRepository $userRepository,
    ) {}

    /**
     * If the `installationStatus` of the App is `false` (i.e., the installation procedure has not run yet),
     * this endpoint will configure everything necessary for the App to be usable.
     *
     * This procedure will fail if the `installationStatus` is already `true`.
     *
     * Requires that the first user has been created and fails otherwise. The first user can be
     * created using the User POST endpoint.
     *
     * Gives administrative rights to the first user and sets the `installationStatus` to `true`.
     */
    #[Route('/api/install', name: 'api_install', methods: ['POST'])]
    public function install(): Response {
        $installationStatus = $this->entityManager->getRepository(InstallationStatus::class)->findOneBy([]);
        if ($installationStatus->isStatus()) {
            return (new Response)->setStatusCode(405);
        }

        if (!($user = $this->userRepository->find(1))) {
            return (new Response)->setStatusCode(405);
        }

        $user
            ->setRoles([Role::USER, Role::ADMIN, Role::USER_ADMINISTRATION])
            ->setActive(true);

        $this->userRepository->save($user);

        $installationStatus->setStatus(true);

        $this->entityManager->persist($installationStatus);
        $this->entityManager->flush();

        $this->refreshDataTimestampUtil->updateTimestamp();

        return (new Response)->setStatusCode(204);
    }
}
