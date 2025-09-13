import { JsonLogin } from "@/pages/Login/JsonLogin"
import { Logout } from "@/pages/Logout/Logout"
import { PageNotFound } from "@/pages/PageNotFound/PageNotFound"
import { PantryPage } from "@/pages/Pantry/PantryPage"
import { AddMeal } from "@/pages/Planner/AddMeal"
import { EditMealPage } from "@/pages/Planner/EditMealPage"
import { Planner } from "@/pages/Planner/Planner"
import { AddRecipe } from "@/pages/Recipes/AddRecipe"
import { EditRecipe } from "@/pages/Recipes/EditRecipe"
import { ImportRecipe } from "@/pages/Recipes/ImportRecipe"
import { RecipeListPage } from "@/pages/Recipes/RecipeListPage"
import { RecipePage } from "@/pages/Recipes/RecipePage"
import { RestoreRecipePage } from "@/pages/Recipes/RestoreRecipePage"
import { Registration } from "@/pages/Registration/Registration"
import { AddGroup } from "@/pages/Settings/AddGroup"
import { EditGroup } from "@/pages/Settings/EditGroup"
import { Settings } from "@/pages/Settings/Settings"
import { UserAdministration } from "@/pages/Settings/UserAdministration"
import { UserSettings } from "@/pages/Settings/UserSettings"
import { ShoppingListPage } from "@/pages/ShoppingList/ShoppingListPage"
import { Maybe } from "@/types/Maybe"
import { Page } from "@/types/Page"

export const PAGE_CONFIGS: Page[] = [
    {
        id: "planner",
        path: "/planner",
        element: <Planner />,
        authenticationNeeded: true,
    },
    {
        id: "planner_meal_add",
        path: "/planner/add/:id",
        element: <AddMeal />,
        authenticationNeeded: true,
    },
    {
        id: "planner_meal_edit",
        path: "/planner/edit/:id",
        element: <EditMealPage />,
        authenticationNeeded: true,
    },
    {
        id: "shoppinglist",
        path: "/shoppinglist",
        element: <ShoppingListPage />,
        authenticationNeeded: true,
    },
    {
        id: "recipes",
        path: "/recipes",
        element: <RecipeListPage />,
        authenticationNeeded: true,
    },
    {
        id: "recipe_import",
        path: "/recipe/import",
        element: <ImportRecipe />,
        authenticationNeeded: true,
    },
    {
        id: "recipe_add",
        path: "/recipe/add",
        element: <AddRecipe />,
        authenticationNeeded: true,
    },
    {
        id: "recipe",
        path: "/recipe/:id",
        element: <RecipePage />,
        authenticationNeeded: true,
    },
    {
        id: "recipe_edit",
        path: "/recipe/:id/edit",
        element: <EditRecipe />,
        authenticationNeeded: true,
    },
    {
        id: "recipe_restore",
        path: "/recipes/restore",
        element: <RestoreRecipePage />,
        authenticationNeeded: true,
    },
    {
        id: "pantry",
        path: "/pantry",
        element: <PantryPage />,
        authenticationNeeded: true,
    },
    {
        id: "settings",
        path: "/settings",
        element: <Settings />,
        authenticationNeeded: true,
    },
    {
        id: "settings_groups_add",
        path: "/settings/groups/add",
        element: <AddGroup />,
        authenticationNeeded: true,
    },
    {
        id: "settings_group_edit",
        path: "/settings/group/:id/edit",
        element: <EditGroup />,
        authenticationNeeded: true,
    },
    {
        id: "settings_user",
        path: "/settings/user",
        element: <UserSettings />,
        authenticationNeeded: true,
    },
    {
        id: "settings_user_edit",
        path: "/settings/user/:id/edit",
        element: <UserAdministration />,
        authenticationNeeded: true,
    },
    {
        id: "login",
        path: "/login",
        element: <JsonLogin />,
    },
    {
        id: "logout",
        path: "/logout",
        element: <Logout />,
    },
    {
        id: "register",
        path: "/register",
        element: <Registration />,
    },
    {
        id: "page_not_found",
        path: "*",
        element: <PageNotFound />,
    },
]

export const findPage = (pageId: string): Page => {
    const page: Maybe<Page> = PAGE_CONFIGS.find(page => page.id === pageId)

    if (!page) {
        throw Error(`Page identifier ${pageId} does not exist.`)
    }

    return page
}
