<?php namespace App\Service;

use App\Entity\EntityModel;

/**
 * SettingsUtil
 */
class SettingsUtil extends EntityUtil
{
    /** @param Settings $settings */
    public function getApiModel(EntityModel $settings): array
    {
        return [
            'showPantry' => $settings->isShowPantry(),
        ];
    }
}
