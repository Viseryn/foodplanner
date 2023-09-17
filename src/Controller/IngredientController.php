<?php namespace App\Controller;

use App\Entity\Ingredient;
use App\Repository\IngredientRepository;
use App\Service\DtoResponseService;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/ingredients')]
final class IngredientController extends AbstractControllerWithMapper
{
    public function __construct(
        private readonly IngredientRepository $ingredientRepository,
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ) {
        parent::__construct(Ingredient::class);
    }

    #[Route('/{id}', name: 'api_ingredients_patch', methods: ['PATCH'])]
    public function patch(
        Request $request,
        Ingredient $ingredient,
    ): Response {
        $data = json_decode($request->getContent(), false);

        if (property_exists($data, "checked") && is_bool($data->checked)) {
            $ingredient->setChecked($data->checked);
        }

        if (property_exists($data, "position") && is_int($data->position)) {
            $ingredient->setPosition($data->position);
        }

        if (property_exists($data, "name") && is_string($data->name)) {
            $ingredient->setName($data->name);
        }

        if (property_exists($data, "quantityValue") && is_string($data->quantityValue)) {
            $ingredient->setQuantityValue($data->quantityValue);
        }

        if (property_exists($data, "quantityUnit") && is_string($data->quantityUnit)) {
            $ingredient->setQuantityUnit($data->quantityUnit);
        }

        $this->ingredientRepository->save($ingredient, true);
        $this->refreshDataTimestampUtil->updateTimestamp();
        return DtoResponseService::getResponse($this->mapper->entityToDto($ingredient));
    }

    #[Route('/{id}', name: 'api_ingredients_delete', methods: ['DELETE'])]
    public function deleteIngredientById(Ingredient $ingredient): Response
    {
        $this->ingredientRepository->remove($ingredient, true);
        $this->refreshDataTimestampUtil->updateTimestamp();
        return DtoResponseService::getResponse($this->mapper->entityToDto($ingredient));
    }
}
