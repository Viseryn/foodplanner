<?php namespace App\Tests\Service;

use App\Entity\Recipe;
use App\Service\ClassnameMapperService;
use PHPUnit\Framework\TestCase;

final class ClassnameMapperServiceTest extends TestCase
{
    private ClassnameMapperService $classnameMapperService;

    public function __construct()
    {
        parent::__construct();
        $this->classnameMapperService = new ClassnameMapperService;
    }

    public function test_mapperForEntity_full()
    {
        $this->assertEquals(
            '\App\Mapper\RecipeMapper',
            $this->classnameMapperService->mapperForEntity(Recipe::class, true),
        );
    }

    public function test_mapperForEntity_notFull()
    {
        $this->assertEquals(
            'RecipeMapper',
            $this->classnameMapperService->mapperForEntity(Recipe::class),
        );
    }

    public function test_dtoForEntity_full()
    {
        $this->assertEquals(
            '\App\DataTransferObject\RecipeDTO',
            $this->classnameMapperService->dtoForEntity(Recipe::class, true),
        );
    }

    public function test_dtoForEntity_notFull()
    {
        $this->assertEquals(
            'RecipeDTO',
            $this->classnameMapperService->dtoForEntity(Recipe::class),
        );
    }
}
