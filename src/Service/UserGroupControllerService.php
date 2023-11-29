<?php namespace App\Service;

use App\DataTransferObject\UserGroupDTO;
use App\Entity\UserGroup;
use App\Mapper\Mapper;
use App\Mapper\MapperFactory;
use App\Repository\MealRepository;
use App\Repository\UserGroupRepository;
use Doctrine\Common\Collections\ArrayCollection;

class UserGroupControllerService
{
    private Mapper $mapper;

    public function __construct(
        private readonly MealRepository $mealRepository,
        private readonly UserGroupRepository $userGroupRepository,
        private readonly MapperFactory $mapperFactory,
    ) {
        $this->mapper = $this->mapperFactory::getMapperFor(UserGroup::class);
    }

    /**
     * @return ArrayCollection<UserGroupDTO>
     */
    public function getAllUserGroups(): ArrayCollection
    {
        return (new ArrayCollection($this->userGroupRepository->findBy([], ['position' => 'ASC'])))
            ->map(fn ($userGroup) => $this->mapper->entityToDto($userGroup));
    }

    /**
     * @return ArrayCollection<UserGroupDTO>
     */
    public function getAllUserGroupsByHidden(bool $hidden): ArrayCollection
    {
        return (new ArrayCollection($this->userGroupRepository->findBy(['hidden' => $hidden], ['position' => 'ASC'])))
            ->map(fn ($userGroup) => $this->mapper->entityToDto($userGroup));
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
