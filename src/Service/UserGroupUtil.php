<?php namespace App\Service;

use App\Entity\EntityInterface;
use App\Entity\UserGroup;
use App\Repository\UserGroupRepository;

/**
 * UserGroupUtil
 */
class UserGroupUtil extends EntityUtil
{
    private UserGroupRepository $userGroupRepository;
    private UserUtil $userUtil;

    public function __construct(
        UserGroupRepository $userGroupRepository,
        UserUtil $userUtil,
    ) {
        $this->userGroupRepository = $userGroupRepository;
        $this->userUtil = $userUtil;
    }

    /** @param UserGroup $userGroup */
    public function getApiModel(EntityInterface $userGroup): array
    {
        return [
            'id' => $userGroup->getId(),
            'name' => $userGroup->getName(),
            'icon' => $userGroup->getIcon(),
            'users' => $this->userUtil->getApiModels($userGroup->getUsers()),
            'option' => [
                'id' => 'userGroup_' . $userGroup->getName(),
                'label' => $userGroup->getName(),
                'icon' => $userGroup->getIcon(),
                'checked' => false,
                'value' => $userGroup->getId(),
            ],
        ];
    }
    
    /**
     * Updates the standard UserGroup.
     *
     * @param array $groups An array of UserGroupModel JSON objects.
     * @return void
     */
    public function updateStandard(array $groups): void 
    {
        // Update each UserGroup in the database according to the request array
        foreach ($groups as $group) {
            // Set this to true when standard is set, so there is only one standard group
            $setStandard = false;

            // Get UserGroup from db
            $groupDb = $this->userGroupRepository->find($group->id);
            
            if ($group->standard && !$setStandard) {
                $groupDb->setStandard(true);
                $setStandard = true;
            } else {
                $groupDb->setStandard(false);
            }

            // Update group in database
            $this->userGroupRepository->add($groupDb, true);
        }
    }
}
