<?php

namespace App\EventSubscriber;

use App\Component\Response\PrettyJsonResponse;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\Event\LogoutEvent;

final class LogoutSubscriber implements EventSubscriberInterface {
    public static function getSubscribedEvents(): array {
        return [LogoutEvent::class => 'onLogout'];
    }

    public function onLogout(LogoutEvent $event): void {
        $event->setResponse(new PrettyJsonResponse(['message' => 'Logout successful'], 200));
    }
}
