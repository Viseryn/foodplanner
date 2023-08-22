<?php namespace App\Controller;

use App\DataTransferObject\DTOSerializer;
use App\DataTransferObject\IngredientDTO;
use App\DataTransferObject\StorageDTO;
use App\Entity\Storage;
use App\Repository\IngredientRepository;
use App\Repository\StorageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/storages')]
final class StorageController extends AbstractController
{
    public function __construct(
        private IngredientRepository $ingredientRepository,
        private StorageRepository $storageRepository,
    ) {}

    #[Route('', name: 'api_storages_getAll', methods: ['GET'])]
    public function getAll(): Response
    {
        $storageDTOs = (new ArrayCollection($this->storageRepository->findAll()))
            ->map(fn ($storage) => new StorageDTO($storage));
        return DTOSerializer::getResponse($storageDTOs);
    }

    #[Route('/{id}', name: 'api_storages_getById', methods: ['GET'])]
    public function getById(Storage $storage): Response
    {
        return DTOSerializer::getResponse(new StorageDTO($storage));
    }

    #[Route('/{id}/ingredients', name: 'api_storages_getById_ingredients', methods: ['GET'])]
    public function getIngredientsById(Storage $storage): Response
    {
        $ingredientDTOs = (new ArrayCollection($this->ingredientRepository->findBy(['storage' => $storage->getId()], ['position' => 'ASC'])))
            ->map(fn ($ingredient) => new IngredientDTO($ingredient));
        return DTOSerializer::getResponse($ingredientDTOs);
    }
}
