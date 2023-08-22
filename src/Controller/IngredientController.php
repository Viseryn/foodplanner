<?php namespace App\Controller;

use App\DataTransferObject\DTOSerializer;
use App\DataTransferObject\IngredientDTO;
use App\Entity\Ingredient;
use App\Repository\IngredientRepository;
use App\Service\IngredientUtil;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/ingredients')]
final class IngredientController extends AbstractController
{
    public function __construct(
        private IngredientRepository $ingredientRepository,
        private IngredientUtil $ingredientUtil,
        private RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ) {
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

        if (property_exists($data, "name") && is_string($data->name)) {
            $ingredient->setName($this->ingredientUtil->getNameFromString($data->name));

            // TODO: Should be independent of name.
            if (property_exists($data, "quantityValue") && is_string($data->quantityValue)) {
                $ingredient->setQuantityValue($this->ingredientUtil->getQuantityValueFromString($data->name));
            }

            if (property_exists($data, "quantityUnit") && is_string($data->quantityUnit)) {
                $ingredient->setQuantityUnit($this->ingredientUtil->getQuantityUnitFromString($data->name));
            }
        }

        $this->ingredientRepository->save($ingredient, true);
        $this->refreshDataTimestampUtil->updateTimestamp();
        return DTOSerializer::getResponse(new IngredientDTO($ingredient));
    }

    #[Route('/{id}', name: 'api_ingredients_delete', methods: ['DELETE'])]
    public function deleteIngredientById(Ingredient $ingredient): Response
    {
        $this->ingredientRepository->remove($ingredient, true);
        $this->refreshDataTimestampUtil->updateTimestamp();
        return DTOSerializer::getResponse(new IngredientDTO($ingredient));
    }
}
