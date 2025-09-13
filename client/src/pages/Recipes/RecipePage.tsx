import TextParagraph from "@/components/skeleton/TextParagraph"
import Button from "@/components/ui/Buttons/Button"
import { CardHeading } from "@/components/ui/Cards/CardHeading"
import { CollapsibleCard } from "@/components/ui/Cards/CollapsibleCard"
import { InnerCard } from "@/components/ui/Cards/InnerCard"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Notification from "@/components/ui/Notification"
import Spacer from "@/components/ui/Spacer"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SettingsContext } from "@/context/SettingsContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { UserContext } from "@/context/UserContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { usePlannerDates } from "@/hooks/usePlannerDates"
import { stateCacheStore } from "@/hooks/useStateCache"
import useTimeout from "@/hooks/useTimeout"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { TwoColumnView } from "@/layouts/TwoColumnView"
import { TooltippedInstruction } from "@/pages/Recipes/components/TooltippedInstruction"
import { RecipeTranslations } from "@/pages/Recipes/RecipeTranslations"
import { isFavorite } from "@/pages/Recipes/util/isFavorite"
import { Detached } from "@/types/api/Detached"
import { Ingredient } from "@/types/api/Ingredient"
import { Iri } from "@/types/api/Iri"
import { Meal } from "@/types/api/Meal"
import { Recipe } from "@/types/api/Recipe"
import { Settings as SettingsApiResource } from "@/types/api/Settings"
import { User } from "@/types/api/User"
import { PANTRY_IRI } from "@/types/constants/PANTRY_IRI"
import { SHOPPINGLIST_IRI } from "@/types/constants/SHOPPINGLIST_IRI"
import { DateKey } from "@/types/DateKey"
import { GlobalAppData } from "@/types/GlobalAppData"
import { ManagedResource } from "@/types/ManagedResource"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { StorageIngredient } from "@/types/StorageIngredient"
import { Topbar } from "@/types/topbar/Topbar"
import { apiClient } from "@/util/apiClient"
import { ApiRequest } from "@/util/ApiRequest"
import { getHighestPosition } from "@/util/ingredients/getHighestPosition"
import { StringBuilder } from "@/util/StringBuilder"
import Fraction from "fraction.js"
import React, { ReactElement, useEffect, useState } from "react"
import { NavigateFunction, useNavigate, useParams } from "react-router-dom"
import swal from "sweetalert"

/**
 * @todo Change the color of the select arrow.
 * @todo Write an easier to read skeleton.
 */
export const RecipePage = (): ReactElement => {
    const t: TranslationFunction = useTranslation(RecipeTranslations)
    const user: ManagedResource<User> = useNullishContext(UserContext)
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const settings: ManagedResource<SettingsApiResource> = useNullishContext(SettingsContext)
    const { meals, recipes, shoppingList, pantry }: Partial<GlobalAppData> = useNullishContext(GlobalAppDataContext)
    const dateMealMap: Map<DateKey, Meal[]> = usePlannerDates()

    // Type for route parameters
    type RecipeRouteParams = {
        id?: string
    }

    // The id parameter of the route '/recipe/:id'.
    const { id }: RecipeRouteParams = useParams()

    // A function that can change location. Needed for the edit topbar action button.
    const navigate: NavigateFunction = useNavigate()

    // The currently selected recipe. Will be updated whenever id changes.
    const [recipe, setRecipe] = useState<Recipe>({} as Recipe)

    // A temporary state variable for the recipe. This object changes whenever recipe or portionSize change.
    const [tmpRecipe, setTmpRecipe] = useState<Recipe>({} as Recipe)

    // The portion size. Can be selected in an input field in the ingredients section.
    // Whenever this value is changed, tmpRecipe will be updated.
    const [portionSize, setPortionSize] = useState<number>(0)

    // Whether the SidebarActionButton should display "Done!" on click.
    const [showShoppingListDone, setShowShoppingListDone] = useState<boolean>(false)

    // Whether the "Add to Pantry" button should display "Done!" on click.
    const [showPantryDone, setShowPantryDone] = useState<boolean>(false)

    // Timeouts for Done-info
    const { clearTimeout: clearShoppingListTimeout, startTimeout: startShoppingListTimeout }
        = useTimeout(() => {
        setShowShoppingListDone(false)
    }, 5000)
    const { clearTimeout: clearPantryTimeout, startTimeout: startPantryTimeout }
        = useTimeout(() => {
        setShowPantryDone(false)
    }, 5000)

    /**
     * Handles adding the whole recipe to the ShoppingList. Is invoked by the SAB.
     */
    const handleAddShoppingList = async (argRecipe: Recipe): Promise<void> => {
        clearShoppingListTimeout()

        if (shoppingList.isLoading) {
            return
        }

        // Optimistic feedback
        setShowShoppingListDone(true)
        startShoppingListTimeout()

        const highestPosition = getHighestPosition(shoppingList.data)

        const ingredientsToAdd: Detached<StorageIngredient>[] = argRecipe.ingredients?.map((ingredient, index) => ({
            "@type": "Ingredient",
            name: ingredient.name,
            quantityUnit: ingredient.quantityUnit,
            quantityValue: ingredient.quantityValue,
            position: highestPosition + index + 1,
            storage: SHOPPINGLIST_IRI,
            checked: false,
        }))

        if (ingredientsToAdd?.length) {
            const responses: StorageIngredient[] = []

            const postRequests: Promise<boolean>[] = ingredientsToAdd.map((ingredient: Detached<StorageIngredient>) => (
                ApiRequest
                    .post<StorageIngredient>("/api/ingredients", ingredient)
                    .ifSuccessful(responseData => responses.push(responseData))
                    .execute()
            ))

            await Promise.all(postRequests)
            shoppingList.setData([...responses, ...shoppingList.data])
        }
    }

    /**
     * Handles adding a single ingredient to the ShoppingList.
     * Can be invoked by the IconButtons next to each ingredient.
     */
    const handleAddSingleToShoppingList = async (ingredient: Ingredient): Promise<void> => {
        if (shoppingList.isLoading) {
            return
        }

        const ingredientToAdd: Detached<StorageIngredient> = {
            "@type": "Ingredient",
            name: ingredient.name,
            quantityUnit: ingredient.quantityUnit,
            quantityValue: ingredient.quantityValue,
            position: getHighestPosition(shoppingList.data) + 1,
            storage: SHOPPINGLIST_IRI,
            checked: false,
        }

        void ApiRequest.post<StorageIngredient>("/api/ingredients", ingredientToAdd).ifSuccessful(responseData => {
            shoppingList.setData([responseData, ...shoppingList.data])
        }).execute()
    }

    /**
     * Handles adding the whole recipe to the Pantry. Is invoked by a button under the ingredient list.
     */
    const handleAddPantry = async (argRecipe: Recipe): Promise<void> => {
        clearPantryTimeout()

        if (pantry.isLoading) {
            return
        }

        // Optimistic feedback
        setShowPantryDone(true)
        startPantryTimeout()

        const lastPosition = getHighestPosition(pantry.data)
        const ingredientsToAdd: Detached<StorageIngredient>[] = argRecipe.ingredients?.map((ingredient, index) => ({
            "@type": "Ingredient",
            name: ingredient.name,
            quantityUnit: ingredient.quantityUnit,
            quantityValue: ingredient.quantityValue,
            position: lastPosition + index + 1,
            storage: PANTRY_IRI,
            checked: false,
        }))

        if (ingredientsToAdd?.length) {
            const responses: StorageIngredient[] = []

            const postRequests: Promise<boolean>[] = ingredientsToAdd.map((ingredient: Detached<StorageIngredient>) => (
                ApiRequest
                    .post<StorageIngredient>("/api/ingredients", ingredient)
                    .ifSuccessful(responseData => responses.push(responseData))
                    .execute()
            ))

            await Promise.all(postRequests)
            pantry.setData([...responses, ...pantry.data])
        }
    }

    /**
     * Handles adding a single ingredient to the Pantry.
     * Can be invoked by the IconButtons next to each ingredient.
     */
    const handleAddSingleToPantry = async (ingredient: Ingredient): Promise<void> => {
        if (pantry.isLoading) {
            return
        }

        const ingredientToAdd: Detached<StorageIngredient> = {
            "@type": "Ingredient",
            name: ingredient.name,
            quantityUnit: ingredient.quantityUnit,
            quantityValue: ingredient.quantityValue,
            position: getHighestPosition(pantry.data) + 1,
            checked: false,
            storage: PANTRY_IRI,
        }

        void ApiRequest.post<StorageIngredient>("/api/ingredients", ingredientToAdd).ifSuccessful(responseData => {
            pantry.setData([responseData, ...pantry.data])
        }).execute()
    }

    const handleFavoriteButtonClick = async (): Promise<void> => {
        if (user.isLoading) {
            return
        }

        const newRecipeFavorites: Iri<Recipe>[] = isFavorite(recipe, user.data)
            ? [...user.data.recipeFavorites.filter(value => value !== recipe["@id"])]
            : [...user.data.recipeFavorites, recipe["@id"]]

        user.setData({ ...user.data, recipeFavorites: newRecipeFavorites })

        void ApiRequest.patch<User>("/api/users/me", { recipeFavorites: newRecipeFavorites }).execute()
    }

    const deleteRecipe = async (id?: string): Promise<void> => {
        if (!id) {
            return
        }

        const swalResponse = await swal({
            dangerMode: true,
            icon: "error",
            title: "Rezept löschen?",
            text: "Gelöschte Rezepte können wiederhergestellt werden.",
            buttons: ["Abbrechen", "Löschen"],
        })

        if (swalResponse) {
            await ApiRequest.delete(`/api/recipes/${id}`).ifSuccessful(() => {
                recipes.load()
                meals.load()
                navigate("/recipes")
            }).execute()
        }
    }

    // Initializes the recipe state variable. Each time the id parameter changes, the 
    // recipe state is updated. When the recipes are reloaded, recipe is also updated.
    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        // Find correct recipe
        const queryResult: Recipe[] = recipes.data.filter(recipe => recipe.id.toString() == id)
        setRecipe(queryResult[0])

        // If recipe does not exist, redirect to 404 page
        if (queryResult.length === 0) {
            navigate("/error/404")
        }
    }, [id, recipes.isLoading])

    // Put a copy of selected recipe in a local state variable tmpRecipe and save 
    // the original portion size of the recipe in portionSize.
    // These will only be updated on initialization, not when the recipe changes!
    useEffect(() => {
        if (portionSize == 0 || portionSize == undefined) {
            // Set temporary copy of recipe
            setTmpRecipe(recipe)

            // Set initial portion size
            setPortionSize(recipe.portionSize)
        }
    }, [recipe, recipes.data])

    // Calculate the ingredient quantities depending on selected portionSize
    useEffect(() => {
        if (recipes.isLoading) {
            return
        }

        const newRecipe: Recipe = { ...recipe }
        newRecipe.ingredients = []
        newRecipe.portionSize = portionSize

        recipe.ingredients?.forEach(ingredient => {
            const newIngredient: Ingredient = { ...ingredient }

            const newQuantityValue: Fraction = new Fraction(ingredient.quantityValue ? ingredient.quantityValue : "0")

            newIngredient["quantityValue"] = newQuantityValue
                .div(new Fraction(recipe.portionSize))
                .mul(new Fraction(portionSize))
                .toFraction(true)

            if (newIngredient["quantityValue"] === "0") {
                newIngredient["quantityValue"] = ""
            }

            newRecipe.ingredients.push(newIngredient)
        })

        // Set the new calculated recipe in tmpRecipe. This does NOT trigger a reassignment of portionSize.
        setTmpRecipe(newRecipe)
    }, [portionSize])

    useEffect(() => {
        if (user.isLoading) {
            return
        }

        if (!meals.isLoading) {
            sidebar.configuration
                   .activeItem("recipes")
                   .actionButton({
                       isVisible: true,
                       icon: "calendar_add_on",
                       label: t("sab.label"),
                       path: `/planner/add/${[...dateMealMap.keys()][0]}?recipe=${recipe.id}`,
                   })
                   .rebuild()
        }

        topbar.configuration
              .title(recipe.title)
              .backButton({ isVisible: true, path: "/recipes" })
              .actionButtons([
                  { icon: "star", filled: isFavorite(recipe, user.data), onClick: handleFavoriteButtonClick },
              ])
              .dropdownMenuItems([
                  { icon: "contract_edit", label: t("dropdown.edit.recipe"), onClick: () => navigate(`/recipe/${id}/edit`) },
                  { icon: "delete", label: t("dropdown.delete.recipe"), onClick: () => deleteRecipe(id) },
                  {
                      icon: "download",
                      label: t("dropdown.export.recipe"),
                      onClick: () => {
                          const downloadUrl: string = apiClient.defaults.baseURL + `/api/recipes/export/${id}`
                          window.open(downloadUrl, "_blank", "rel=noopener noreferrer")
                      },
                  },
                  {
                      icon: "refresh",
                      label: t("dropdown.refresh"),
                      onClick: () => {
                          setPortionSize(0)
                          recipes.load()
                      },
                  },
              ])
              .truncate(true)
              .mainViewWidth("md:max-w-[900px]")
              .isLoading(recipes.isLoading)
              .rebuild()

        window.scrollTo(0, 0)
    }, [recipe, meals.isLoading, user.isLoading, user.data])

    return <StandardContentWrapper>
        {/* Image */}
        {recipes.isLoading
            ? /* Recipe Skeleton */ <img className="animate-pulse rounded-3xl h-80 w-full object-cover" src="/img/default.jpg" alt="" />
            : (recipe.image &&
                <>
                    <img
                        className="rounded-3xl h-80 object-cover transition duration-300 w-full"
                        src={apiClient.defaults.baseURL + recipe.image.directory + recipe.image.filename}
                        alt={recipe.title}
                    />
                    <Spacer height="6" />
                </>
            )
        }

        <TwoColumnView>
            {/* Ingredients, instructions and buttons */}
            {recipes.isLoading ? (
                <div>
                    {/* Recipe Skeleton */}
                    <Spacer height="6" />

                    <OuterCard>
                        <div className="animate-pulse">
                            <div className="h-10 bg-notification-500 dark:bg-notification-700 rounded-full w-3/4 md:w-1/2" />
                        </div>
                        <Spacer height="4" />
                        <InnerCard>
                            <TextParagraph />
                            <Spacer height="2" />
                            <TextParagraph />
                        </InnerCard>
                    </OuterCard>
                </div>
            ) : (
                <>
                    {/* Ingredients */}
                    {tmpRecipe.ingredients?.length > 0 && (
                        <div>
                            <CollapsibleCard {...{
                                cardComponent: OuterCard,
                                heading: (
                                    <CardHeading size="text-xl" className="ml-2">
                                        {t("ingredients.card.title.1")}
                                        <select
                                            value={portionSize}
                                            onChange={e => setPortionSize(+e.target.value)}
                                            className="dark:placeholder-secondary-dark-900 dark:bg-secondary-dark-200 border border-gray-300 dark:border-none rounded-md h-10 w-20 px-6 mx-4 transition duration-300 focus:border-primary-100 dark:after:bg-red-500"
                                        >
                                            {[...Array(10)].map((value, index) =>
                                                <option
                                                    key={index + 1}
                                                    value={index + 1}
                                                >
                                                    {index + 1}
                                                </option>,
                                            )}
                                        </select>
                                        {portionSize == 1 ? t("ingredients.card.title.2") : t("ingredients.card.title.3")}
                                    </CardHeading>
                                ),
                                collapsed: stateCacheStore.getState().recipeIngredientsCollapsed,
                                onCollapse: () => stateCacheStore.getState().toggle("recipeIngredientsCollapsed"),
                            }}>
                                <>
                                    <div className="grid grid-cols-1 gap-0.5">
                                        {tmpRecipe.ingredients.map(ingredient =>
                                            <div key={ingredient.id} className="flex items-center justify-between bg-white dark:bg-bg-dark rounded-md first:rounded-t-2xl last:rounded-b-2xl pl-6 pr-4 py-2">
                                                <span>
                                                    {new StringBuilder().append(ingredient.quantityValue).append(ingredient.quantityUnit).build(" ")}

                                                    <span className={StringBuilder.cn(
                                                        "font-semibold",
                                                        [!!ingredient.quantityValue || !!ingredient.quantityUnit, "ml-1.5"],
                                                    )}>
                                                        {ingredient.name}
                                                    </span>
                                                </span>

                                                <div className="flex flex-row">
                                                    <Button
                                                        className={"shoppinglist-" + ingredient.id}
                                                        onClick={async () => {
                                                            const element = document.getElementsByClassName("shoppinglist-" + ingredient.id)[0].firstChild! as HTMLElement
                                                            setTimeout(() => {
                                                                element.innerHTML = "add_shopping_cart"
                                                            }, 5000)
                                                            await handleAddSingleToShoppingList(ingredient)
                                                            element.innerHTML = "done"
                                                        }}
                                                        icon="add_shopping_cart"
                                                        outlined={true}
                                                        role="tertiary"
                                                    />
                                                    {settings.data?.showPantry &&
                                                        <Button
                                                            className={"pantry-" + ingredient.id}
                                                            onClick={async () => {
                                                                const element = document.getElementsByClassName("pantry-" + ingredient.id)[0].firstChild! as HTMLElement
                                                                setTimeout(() => {
                                                                    element.innerHTML = "add_home_work"
                                                                }, 5000)
                                                                await handleAddSingleToPantry(ingredient)
                                                                element.innerHTML = "done"
                                                            }}
                                                            icon="add_home_work"
                                                            outlined={true}
                                                            role="tertiary"
                                                        />
                                                    }
                                                </div>
                                            </div>,
                                        )}
                                    </div>
                                </>

                                <div className="flex flex-row md:flex-col items-stretch justify-center gap-1 mt-4">
                                    <div className={"flex-1 flex justify-end md:justify-center"}>
                                        <Button
                                            icon={showShoppingListDone ? "done" : "add_shopping_cart"}
                                            outlined={true}
                                            label={showShoppingListDone ? t("ingredients.button.done") : t("ingredients.button.shoppinglist")}
                                            onClick={() => handleAddShoppingList(tmpRecipe)}
                                            role={showShoppingListDone ? "primary" : "secondary"}
                                            className="flex-1 md:flex-none md:!rounded-full transition-all duration-300"
                                            roundedRight={showShoppingListDone || !settings.data?.showPantry}
                                        />
                                    </div>
                                    {settings.data?.showPantry && (
                                        <div className={"flex-1 flex justify-start md:justify-center"}>
                                            <Button
                                                icon={showPantryDone ? "done" : "add_home_work"}
                                                outlined={true}
                                                label={showPantryDone ? t("ingredients.button.done") : t("ingredients.button.pantry")}
                                                onClick={() => handleAddPantry(tmpRecipe)}
                                                role={showPantryDone ? "primary" : "secondary"}
                                                className="flex-1 md:flex-none md:!rounded-full transition-all duration-300"
                                                roundedLeft={showPantryDone}
                                            />
                                        </div>
                                    )}
                                </div>
                            </CollapsibleCard>
                        </div>
                    )}

                    {/* Instructions and external URL */}
                    {(tmpRecipe.instructions?.length > 0 || recipe.externalUrl) && (
                        <div>
                            {tmpRecipe.instructions?.length > 0 && (
                                <CollapsibleCard {...{
                                    cardComponent: OuterCard,
                                    heading: <CardHeading size="text-xl" className="ml-2">{t("instructions.card.title")}</CardHeading>,
                                    collapsed: stateCacheStore.getState().recipeInstructionsCollapsed,
                                    onCollapse: () => stateCacheStore.getState().toggle("recipeInstructionsCollapsed"),
                                }}>
                                    <div className="space-y-0.5">
                                        {recipe.instructions.map((instruction, index) =>
                                            <div key={instruction.id} className="flex bg-white dark:bg-bg-dark rounded-md first:rounded-t-2xl last:rounded-b-2xl px-6 py-4 gap-4">
                                                <span className={"font-bold "}>{index + 1}.</span>
                                                <TooltippedInstruction instruction={instruction} ingredients={tmpRecipe.ingredients} />
                                            </div>,
                                        )}
                                    </div>
                                </CollapsibleCard>
                            )}

                            {tmpRecipe.instructions?.length > 0 && recipe.externalUrl && (
                                <Spacer height={4} />
                            )}

                            {recipe.externalUrl && (
                                <>
                                    <CollapsibleCard
                                        cardComponent={OuterCard}
                                        heading={<CardHeading size={"text-xl"} className={""}>{t("externalUrl.card.title")}</CardHeading>}
                                    >
                                        <div className={"bg-white dark:bg-bg-dark p-4 rounded-2xl"}>
                                            <div className="flex gap-2">
                                                <span className="material-symbols-rounded text-base">open_in_new</span>

                                                <a
                                                    href={recipe.externalUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={"text-blue-500 underline overflow-hidden text-ellipsis"}
                                                >
                                                    {recipe.externalUrl}
                                                </a>
                                            </div>

                                            <Spacer height={4} />

                                            <p className={"text-sm"}>{t("externalUrl.description")}</p>
                                        </div>
                                    </CollapsibleCard>
                                </>
                            )}
                        </div>
                    )}

                    {/* Show empty card if there is no image, no ingredients and no instructions */}
                    {tmpRecipe.ingredients?.length === 0 && tmpRecipe.instructions?.length === 0 && (
                        <div className="px-4 pt-6 md:p-0">
                            {!tmpRecipe.externalUrl && (
                                <>
                                    <Notification>{t("empty.recipe.notification")}</Notification>
                                    <Spacer height={6} />
                                </>
                            )}

                            <Button
                                label={t("empty.recipe.button.label")}
                                icon={"contract_edit"}
                                outlined={true}
                                className={"place-content-center"}
                                location={`/recipe/${id}/edit`}
                            />
                        </div>
                    )}
                </>
            )}
        </TwoColumnView>

        <div className="mb-[5.5rem]"></div>
    </StandardContentWrapper>
}
