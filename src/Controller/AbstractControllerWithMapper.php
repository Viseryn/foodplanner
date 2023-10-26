<?php namespace App\Controller;

use App\Entity\EntityInterface;
use App\Mapper\Mapper;
use App\Mapper\MapperFactory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
 * @template E of EntityInterface
 */
abstract class AbstractControllerWithMapper extends AbstractController
{
    protected function __construct(
        string $entityClass,
        protected ?MapperFactory $mapperFactory = null,
        /** @var ?Mapper<E> */ protected $mapper = null,
    ) {
        $this->mapperFactory = new MapperFactory();
        $this->mapper = $this->mapperFactory::getMapperFor($entityClass);
    }
}
