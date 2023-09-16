<?php namespace App\Controller;

use App\Entity\MealCategory;
use App\Repository\MealCategoryRepository;
use App\Service\DtoResponseService;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * MealCategory API
 */
#[Route('/api/mealcategories')]
class MealCategoryController extends AbstractControllerWithMapper
{
    public function __construct(
        private readonly MealCategoryRepository $mealCategoryRepository,
    ) {
        parent::__construct(MealCategory::class);
    }

    #[Route('', name: 'api_mealcategories_get', methods: ['GET'])]
    public function get(): Response {
        $mealCategoryDTOs = (new ArrayCollection($this->mealCategoryRepository->findAll()))
            ->map(fn ($mealCategory) => $this->mapper->entityToDto($mealCategory));
        return DtoResponseService::getResponse($mealCategoryDTOs);
    }
}
