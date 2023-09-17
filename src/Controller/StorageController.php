<?php namespace App\Controller;

use App\Entity\Ingredient;
use App\Entity\Storage;
use App\Repository\IngredientRepository;
use App\Service\DtoResponseService;
use App\Service\JsonDeserializer;
use App\Service\RefreshDataTimestampUtil;
use App\Service\StorageControllerService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/storages')]
final class StorageController extends AbstractControllerWithMapper
{
    public function __construct(
        private readonly IngredientRepository $ingredientRepository,
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
        private readonly StorageControllerService $storageControllerService,
    ) {
        parent::__construct(Ingredient::class);
    }

    #[Route('/{name}/ingredients', name: 'api_storages_getByName_ingredients_get', methods: ['GET'])]
    public function getIngredientsByName(Storage $storage): Response
    {
        $ingredientDTOs = (new ArrayCollection(
            $this->ingredientRepository->findBy(['storage' => $storage->getId()], ['position' => 'ASC']),
        ))->map(fn ($ingredient) => $this->mapper->entityToDto($ingredient));
        return DtoResponseService::getResponse($ingredientDTOs);
    }

    /** Expects an array of IngredientModel objects. */
    #[Route('/{name}/ingredients', name: 'api_storages_getByName_ingredients_post', methods: ['POST'])]
    public function post(Request $request, Storage $storage): Response
    {
        // @todo Create a method in JsonDeserializer to deal with arrays of DTOs.
        $ingredients = new ArrayCollection;
        $data = json_decode($request->getContent(), false);
        foreach ($data as $ingredientModel) {
            $ingredients->add(
                JsonDeserializer::jsonToEntity(json_encode($ingredientModel), Ingredient::class),
            );
        }

        foreach ($ingredients as $ingredient) {
            $ingredient->setStorage($storage);
            $this->ingredientRepository->save($ingredient, true);
        }

        $this->refreshDataTimestampUtil->updateTimestamp();

        $ingredientDTOs = $ingredients->map(fn ($ingredient) => $this->mapper->entityToDto($ingredient));
        return DtoResponseService::getResponse($ingredientDTOs);
    }

    /**
     * @todo Refactor
     */
    #[Route('/{name}/ingredients', name: 'api_storages_getByName_ingredients_delete', methods: ['DELETE'])]
    public function deleteAllIngredients(
        Storage $storage,
        #[MapQueryParameter] ?bool $checked = null,
    ): Response {
        if ($storage->getName() === 'pantry') {
            if ($checked) {
                return (new Response)->setStatusCode(405);
            }

            $this->storageControllerService->deleteAllIngredients($storage);
            $this->refreshDataTimestampUtil->updateTimestamp();
            return new Response;
        } else if ($storage->getName() === 'shoppinglist') {
            if ($checked === null) {
                $this->storageControllerService->deleteAllIngredients($storage);
                $this->refreshDataTimestampUtil->updateTimestamp();
                return new Response;
            } else if ($checked === false) {
                return (new Response)->setStatusCode(405);
            } else {
                $ingredients = $this->ingredientRepository->findBy(['checked' => true]);
                foreach ($ingredients as $ingredient) {
                    $this->ingredientRepository->remove($ingredient, true);
                }

                $this->refreshDataTimestampUtil->updateTimestamp();
                return new Response;
            }
        }

        return (new Response)->setStatusCode(400);
    }
}
