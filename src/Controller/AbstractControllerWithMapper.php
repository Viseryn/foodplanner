<?php namespace App\Controller;

use App\Mapper\Mapper;
use App\Mapper\MapperFactory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

abstract class AbstractControllerWithMapper extends AbstractController
{
    protected function __construct(
        string $entityClass,
        protected ?MapperFactory $mapperFactory = null,
        protected ?Mapper $mapper = null,
    ) {
        $this->mapperFactory = new MapperFactory();
        $this->mapper = $this->mapperFactory::getMapperFor($entityClass);
    }
}
