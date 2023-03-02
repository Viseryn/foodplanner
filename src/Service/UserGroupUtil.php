<?php namespace App\Service;

use App\Entity\EntityModel;
use App\Entity\UserGroup;

/**
 * UserGroupUtil
 */
class UserGroupUtil extends EntityUtil
{
    private UserUtil $userUtil;

    public function __construct(UserUtil $userUtil) 
    {
        $this->userUtil = $userUtil;
    }

    /** @param UserGroup $userGroup */
    public function getApiModel(EntityModel $userGroup): array
    {
        return [
            'id' => $userGroup->getId(),
            'name' => $userGroup->getName(),
            'icon' => $userGroup->getIcon(),
            'standard' => $userGroup->isStandard(),
            'users' => $this->userUtil->getApiModels($userGroup->getUsers()),
            'option' => [
                'id' => 'userGroup_' . $userGroup->getName(),
                'label' => $userGroup->getName(),
                'icon' => $userGroup->getIcon(),
                'checked' => $userGroup->isStandard(),
                'value' => $userGroup->getId(),
            ],
        ];
    }
}
