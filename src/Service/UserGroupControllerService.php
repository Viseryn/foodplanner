<?php namespace App\Service;

use App\DataTransferObject\UserGroupDTO;
use App\Entity\UserGroup;
use App\Repository\MealRepository;
use App\Repository\UserGroupRepository;
use Doctrine\Common\Collections\ArrayCollection;

class UserGroupControllerService
{
    public function __construct(
        private MealRepository $mealRepository,
        private UserGroupRepository $userGroupRepository,
    ) {}

    /**
     * @return ArrayCollection<UserGroupDTO>
     */
    public function getAllUserGroups(): ArrayCollection
    {
        return (new ArrayCollection($this->userGroupRepository->findAll()))
            ->map(fn ($userGroup) => new UserGroupDTO($userGroup));
    }

    public function removeUserGroup(UserGroup $userGroup): void
    {
        $meals = $this->mealRepository->findBy(['userGroup' => $userGroup->getId()]);
        foreach ($meals as $meal) {
            $this->mealRepository->remove($meal, true);
        }

        $this->userGroupRepository->remove($userGroup, true);
    }
}
