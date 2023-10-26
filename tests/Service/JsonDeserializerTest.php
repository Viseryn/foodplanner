<?php namespace App\Tests\Service;

use App\DataTransferObject\IngredientDTO;
use App\DataTransferObject\MealCategoryDTO;
use App\DataTransferObject\MealDTO;
use App\DataTransferObject\RecipeDTO;
use App\DataTransferObject\UserDTO;
use App\DataTransferObject\UserGroupDTO;
use App\Service\DtoSerializer;
use App\Service\JsonDeserializer;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\TestCase;

final class JsonDeserializerTest extends TestCase
{
    private static ArrayCollection $ingredientDtos;
    private static RecipeDTO $recipeDto;
    private static MealDTO $mealDto;

    public static function setUpBeforeClass(): void
    {
        // Set up IngredientDTOs
        self::$ingredientDtos = new ArrayCollection;
        self::$ingredientDtos->add(
            (new IngredientDTO)->setName("Hackfleisch (gemischt)")
                               ->setQuantityValue("400")
                               ->setQuantityUnit("g")
                               ->setPosition(1)
                               ->setChecked(false),
        );
        self::$ingredientDtos->add(
            (new IngredientDTO)->setName("Maccheroni")
                               ->setQuantityValue("250")
                               ->setQuantityUnit("g")
                               ->setPosition(2)
                               ->setChecked(false),
        );

        // Set up RecipeDTO
        self::$recipeDto = (new RecipeDTO)->setTitle("alla Daddy")
                                          ->setPortionSize(2)
                                          ->setIngredients(self::$ingredientDtos)
                                          ->setInstructions(new ArrayCollection);

        // Set up MealDTO
        $userDtos = new ArrayCollection;
        $userDtos->add(
            (new UserDTO)->setUsername("Kevin")
                         ->setRoles(["ROLE_ADMIN", "ROLE_USER"]),
        );
        $userGroupDto = (new UserGroupDTO)->setUsers($userDtos)
                                          ->setIcon("groups")
                                          ->setName("Alle");
        $mealCategoryDto = (new MealCategoryDTO)->setName("Mittags")
                                                ->setIcon("fastfood");
        self::$mealDto = (new MealDTO)->setRecipe(self::$recipeDto)
                                      ->setUserGroup($userGroupDto)
                                      ->setMealCategory($mealCategoryDto);
    }

    public function test_jsonToDto_IngredientDto()
    {
        $jsonData = '{
            "id": -1,
            "name": "Maccheroni",
            "quantityValue": "250",
            "quantityUnit": "g",
            "position": 2,
            "checked": false,
            "editable": false
        }';

        $this->assertEquals(
            DtoSerializer::serialize(self::$ingredientDtos->get(1)),
            DtoSerializer::serialize(JsonDeserializer::jsonToDto($jsonData, IngredientDTO::class)),
        );
    }

    public function test_jsonToDto_RecipeDto()
    {
        $jsonData = '{
            "title": "alla Daddy",
            "portionSize": 2,
            "ingredients": [
                {
                    "id": -1,
                    "name": "Hackfleisch (gemischt)",
                    "quantityValue": "400",
                    "quantityUnit": "g",
                    "position": 1,
                    "checked": false,
                    "editable": false
                },
                {
                    "id": -1,
                    "name": "Maccheroni",
                    "quantityValue": "250",
                    "quantityUnit": "g",
                    "position": 2,
                    "checked": false,
                    "editable": false
                }
            ],
            "instructions": [],
            "id": -1
        }';

        $this->assertEquals(
            DtoSerializer::serialize(self::$recipeDto),
            DtoSerializer::serialize(JsonDeserializer::jsonToDto($jsonData, RecipeDTO::class)),
        );
    }

    public function test_jsonToDto_MealDTO()
    {
        $jsonData = '{
            "id": 8,
            "recipe": {
                "id": 130,
                "title": "alla Daddy",
                "portionSize": 2,
                "ingredients": [
                    {
                        "id": -1,
                        "name": "Hackfleisch (gemischt)",
                        "quantityValue": "400",
                        "quantityUnit": "g",
                        "position": 1,
                        "checked": false,
                        "editable": false
                    },
                    {
                        "id": -1,
                        "name": "Maccheroni",
                        "quantityValue": "250",
                        "quantityUnit": "g",
                        "position": 2,
                        "checked": false,
                        "editable": false
                    }
                ],
                "instructions": [],
                "image": null
            },
            "mealCategory": {
                "id": 2,
                "name": "Mittags",
                "icon": "fastfood"
            },
            "userGroup": {
                "id": 2,
                "name": "Alle",
                "icon": "groups",
                "users": [
                    {
                        "id": 1,
                        "username": "Kevin",
                        "roles": [
                            "ROLE_ADMIN",
                            "ROLE_USER"
                        ]
                    }
                ]
            }
        }';

        $this->assertEquals(
            DtoSerializer::serialize(self::$mealDto),
            DtoSerializer::serialize(JsonDeserializer::jsonToDto($jsonData, MealDTO::class)),
        );
    }
}
