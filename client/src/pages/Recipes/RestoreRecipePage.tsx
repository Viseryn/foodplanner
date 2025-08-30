import { InnerCard } from "@/components/ui/Cards/InnerCard"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Notification from "@/components/ui/Notification"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { AppContext } from "@/context/AppContext"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useApiResourceCollection } from "@/hooks/useApiResourceCollection"
import { useNullishContext } from "@/hooks/useNullishContext"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { DeletedRecipeImageCard } from "@/pages/Recipes/components/DeletedRecipeImageCard"
import { Recipe } from "@/types/api/Recipe"
import { App } from "@/types/App"
import { ComponentLoadingState } from "@/types/enums/ComponentLoadingState"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import { ReactElement, useEffect, useState } from "react"

export const RestoreRecipePage = (): ReactElement => {
    useSidebarTopbarConfiguration()

    const [loadingState, setLoadingState] = useState<ComponentLoadingState>(ComponentLoadingState.WAITING)

    const undeletedRecipes: ManagedResourceCollection<Recipe> = useNullishContext(GlobalAppDataContext).recipes
    const deletedRecipes: ManagedResourceCollection<Recipe> = useDeletedRecipes(undeletedRecipes)

    const restoreRecipe = async (recipe: Recipe): Promise<void> => {
        setLoadingState(ComponentLoadingState.LOADING)

        await ApiRequest
            .patch<Recipe>(recipe["@id"], { deleted: false })
            .ifSuccessful(() => {
                undeletedRecipes.load()
                deletedRecipes.load()
            })
            .execute()

        setLoadingState(ComponentLoadingState.WAITING)
    }

    return (
        <StandardContentWrapper>
            <OuterCard>
                <InnerCard>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="material-symbols-rounded outlined mr-4">info</span>
                            Hier können gelöschte Rezepte wiederhergestellt werden.
                        </div>
                    </div>
                </InnerCard>

                <Spacer height={6} />

                {deletedRecipes.isLoading || loadingState === ComponentLoadingState.LOADING ? (
                    <Spinner />
                ) : deletedRecipes.data.length === 0 ? (
                    <Notification title="Es wurden keine gelöschten Rezepte gefunden." />
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {deletedRecipes.data.map(recipe => (
                            <DeletedRecipeImageCard key={recipe.id} recipe={recipe} onRestore={restoreRecipe} />
                        ))}
                    </div>
                )}
            </OuterCard>
        </StandardContentWrapper>
    )
}

const useSidebarTopbarConfiguration = (): void => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)

    useEffect(() => {
        sidebar.configuration
               .activeItem("recipes")
               .rebuild()

        topbar.configuration
              .title("Gelöschte Rezepte")
              .backButton({ isVisible: true, path: "/recipes" })
              .mainViewWidth("md:max-w-[700px]")
              .rebuild()
    }, [])
}

const useDeletedRecipes = (undeletedRecipes: ManagedResourceCollection<Recipe>): ManagedResourceCollection<Recipe> => {
    const app: App = useNullishContext(AppContext)

    return useApiResourceCollection(
        "/api/recipes?deleted=true",
        true,
        [app.isLoading, undeletedRecipes.isLoading],
    )
}
