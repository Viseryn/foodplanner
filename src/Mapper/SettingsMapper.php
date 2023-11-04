<?php namespace App\Mapper;

use App\DataTransferObject\SettingsDTO;
use App\Entity\Settings;

/**
 * @implements Mapper<Settings>
 */
final class SettingsMapper implements Mapper
{
    public function __construct(
        private readonly MealCategoryMapper $mealCategoryMapper,
        private readonly UserMapper $userMapper,
        private readonly UserGroupMapper $userGroupMapper,
    ) {
    }

    /**
     * @param SettingsDTO $dto
     * @return Settings
     */
    public function dtoToEntity($dto): Settings
    {
        return (new Settings)->setUser($this->userMapper->dtoToEntity($dto->getUser()))
                             ->setShowPantry($dto->getShowPantry())
                             ->setStandardMealCategory($this->mealCategoryMapper->dtoToEntity($dto->getStandardMealCategory()))
                             ->setStandardUserGroup($this->userGroupMapper->dtoToEntity($dto->getStandardUserGroup()));
    }

    /**
     * @param Settings $entity
     * @return SettingsDTO
     */
    public function entityToDto($entity): SettingsDTO
    {
        return (new SettingsDto)->setId($entity->getId())
                                ->setUser($this->userMapper->entityToDto($entity->getUser()))
                                ->setShowPantry($entity->isShowPantry())
                                ->setStandardMealCategory(
                                    $entity->getStandardMealCategory() != null
                                        ? $this->mealCategoryMapper->entityToDto($entity->getStandardMealCategory())
                                        : null
                                )
                                ->setStandardUserGroup(
                                    $entity->getStandardUserGroup() != null
                                        ? $this->userGroupMapper->entityToDto($entity->getStandardUserGroup())
                                        : null
                                );
    }
}
