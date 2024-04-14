<?php namespace App\Controller;

use App\DataTransferObject\InstallationStatusDTO;
use App\Repository\InstallationStatusRepository;
use App\Service\DtoResponseService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/installation-status')]
class InstallationStatusController extends AbstractController
{
    public function __construct(
        private readonly InstallationStatusRepository $installationStatusRepository,
    ) {

    }

    #[Route('', name: 'api_installation_status_get')]
    public function get(): Response
    {
        $installationStatus = $this->installationStatusRepository->find(1);
        $dto = (new InstallationStatusDTO)->setStatus($installationStatus->isStatus())
                                          ->setUpdateV16($installationStatus->isUpdateV16())
                                          ->setVersion($installationStatus->getVersion());
        return DtoResponseService::getResponse($dto);
    }
}
