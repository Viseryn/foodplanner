<?php

namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Meal;
use App\Entity\Settings;
use App\Entity\UserGroup;
use Doctrine\ORM\EntityManagerInterface;
use InvalidArgumentException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

final readonly class DeleteUserGroupProcessor implements ProcessorInterface {

    public function __construct(
        private EntityManagerInterface $entityManager,
        #[Autowire(service: 'api_platform.doctrine.orm.state.remove_processor')]
        private ProcessorInterface $removeProcessor,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []) {
        if (!$data instanceof UserGroup) {
            throw new InvalidArgumentException("Expected instance of UserGroup");
        }

        if ($data->isReadonly()) {
            throw new MethodNotAllowedHttpException([], "Readonly user groups cannot be deleted.");
        }

        $standardUserGroups = array_map(
            fn (Settings $settings): ?UserGroup => $settings->getStandardUserGroup(),
            $this->entityManager->getRepository(Settings::class)->findAll(),
        );

        if (in_array($data, $standardUserGroups)) {
            throw new MethodNotAllowedHttpException([], "User group cannot be deleted because a user set it as their standard group.");
        }

        $meals = $this->entityManager->getRepository(Meal::class)->findBy(['userGroup' => $data->getId()]);
        foreach ($meals as $meal) {
            $this->entityManager->remove($meal);
        }
        $this->entityManager->flush();

        $this->removeProcessor->process($data, $operation, $uriVariables, $context);

        return $data;
    }
}
