<?php namespace App\Service;

use App\Entity\EntityInterface;

/**
 * SettingsUtil
 */
class SettingsUtil extends EntityUtil
{
    /** @param Settings $settings */
    public function getApiModel(EntityInterface $settings): array
    {
        return [
            'showPantry' => $settings->isShowPantry(),
        ];
    }
}
