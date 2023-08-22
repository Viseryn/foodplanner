<?php namespace App\Controller;

use App\DataTransferObject\DTOSerializer;
use App\DataTransferObject\IngredientDTO;
use App\DataTransferObject\StorageDTO;
use App\Entity\Storage;
use App\Repository\IngredientRepository;
use App\Repository\StorageRepository;
use App\Service\PantryUtil;
use App\Service\RefreshDataTimestampUtil;
use App\Service\ShoppingListUtil;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/storages')]
final class StorageController extends AbstractController
{
    public function __construct(
        private IngredientRepository $ingredientRepository,
        private PantryUtil $pantryUtil,
        private RefreshDataTimestampUtil $refreshDataTimestampUtil,
        private StorageRepository $storageRepository,
        private ShoppingListUtil $shoppingListUtil,
    ) {}

    #[Route('', name: 'api_storages_getAll', methods: ['GET'])]
    public function getAll(): Response
    {
        $storageDTOs = (new ArrayCollection($this->storageRepository->findAll()))
            ->map(fn ($storage) => new StorageDTO($storage));
        return DTOSerializer::getResponse($storageDTOs);
    }

    #[Route('/{id}', name: 'api_storages_getById', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getById(Storage $storage): Response
    {
        return DTOSerializer::getResponse(new StorageDTO($storage));
    }

    #[Route('/{name}', name: 'api_storages_getByName', methods: ['GET'])]
    public function getByName(Storage $storage): Response
    {
        return DTOSerializer::getResponse(new StorageDTO($storage));
    }

    #[Route('/{id}/ingredients', name: 'api_storages_getById_ingredients', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function getIngredientsById(Storage $storage): Response
    {
        return $this->getIngredients($storage);
    }

    #[Route('/{name}/ingredients', name: 'api_storages_getByName_ingredients', methods: ['GET'])]
    public function getIngredientsByName(Storage $storage): Response
    {
        return $this->getIngredients($storage);
    }

    private function getIngredients(Storage $storage): Response
    {
        $ingredientDTOs = (new ArrayCollection($this->ingredientRepository->findBy(['storage' => $storage->getId()], ['position' => 'ASC'])))
            ->map(fn ($ingredient) => new IngredientDTO($ingredient));
        return DTOSerializer::getResponse($ingredientDTOs);
    }

    /**
     * @todo Should respond with the new list of ingredients.
     */
    #[Route('/{name}/ingredients', name: 'api_storages_getByName_ingredients_post', methods: ['POST'])]
    public function post(Request $request, Storage $storage): Response
    {
        $requestContent = json_decode($request->getContent());

        switch ($storage->getName()) {
            case 'pantry':
                $this->pantryUtil->add($requestContent);
                break;
            case 'shoppinglist':
                $this->shoppingListUtil->add($requestContent);
                break;
            default:
                throw new \BadMethodCallException();
        }

        $this->refreshDataTimestampUtil->updateTimestamp();
        return new Response;
    }
}
