<?php

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Ingredient;
use App\Entity\Meal;
use App\Entity\Recipe;
use App\Entity\UserGroup;
use App\Service\RefreshDataTimestampUtil;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class RefreshDataTimestampSubscriber implements EventSubscriberInterface {

    private static array $RELEVANT_METHODS = [
        Request::METHOD_POST,
        Request::METHOD_PATCH,
        Request::METHOD_DELETE,
    ];

    private static array $RELEVANT_ENTITIES = [
        UserGroup::class,
        Meal::class,
        Ingredient::class,
        Recipe::class,
    ];

    public function __construct(
        private readonly RefreshDataTimestampUtil $refreshDataTimestampUtil,
    ) {}

    public static function getSubscribedEvents(): array {
        return [
            KernelEvents::VIEW => ['updateRefreshDataTimestamp', EventPriorities::POST_WRITE],
        ];
    }

    public function updateRefreshDataTimestamp(ViewEvent $event): void {
        $method = $event->getRequest()->getMethod();

        if (!in_array($method, self::$RELEVANT_METHODS)) {
            return;
        }

        $entity = $event->getControllerResult() ?? $event->controllerArgumentsEvent->getArguments()[0];

        if (!in_array(get_class($entity), self::$RELEVANT_ENTITIES)) {
            return;
        }

        $this->refreshDataTimestampUtil->updateTimestamp();
    }
}
