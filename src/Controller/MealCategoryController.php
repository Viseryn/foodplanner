<?php namespace App\Controller;

use App\DataTransferObject\DTOSerializer;
use App\DataTransferObject\MealCategoryDTO;
use App\Repository\MealCategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * MealCategory API
 */
#[Route('/api/mealcategories')]
class MealCategoryController extends AbstractController
{
    public function __construct(
        private MealCategoryRepository $mealCategoryRepository,
    ) {}

    #[Route('', name: 'api_mealcategories_get', methods: ['GET'])]
    public function get(): Response {
        $mealCategoryDTOs = (new ArrayCollection($this->mealCategoryRepository->findAll()))
            ->map(fn ($mealCategory) => new MealCategoryDTO($mealCategory));
        return DTOSerializer::getResponse($mealCategoryDTOs);
    }
}
