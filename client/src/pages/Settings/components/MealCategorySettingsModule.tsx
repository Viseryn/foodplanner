import IconButton from "@/components/ui/Buttons/IconButton"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { SettingsTranslations } from "@/pages/Settings/SettingsTranslations"
import { Detached } from "@/types/api/Detached"
import { MealCategory } from "@/types/api/MealCategory"
import { Settings } from "@/types/api/Settings"
import { ManagedResource } from "@/types/ManagedResource"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { ApiRequest } from "@/util/ApiRequest"
import { ReactElement } from "react"

type MealCategorySettingsModuleProps = {
    mealCategories: ManagedResourceCollection<MealCategory>
    settings: ManagedResource<Settings>
}

export const MealCategorySettingsModule = (props: MealCategorySettingsModuleProps): ReactElement => {
    const { mealCategories, settings } = props

    const t: TranslationFunction = useTranslation(SettingsTranslations)

    const handleSetStandardMealCategory = async (mealCategory: MealCategory): Promise<void> => {
        if (settings.isLoading) {
            return
        }

        const settingsPatch: Partial<Detached<Settings>> = { standardMealCategory: mealCategory["@id"] }

        // Optimistic feedback
        settings.setData({ ...settings.data, ...settingsPatch })

        await ApiRequest
            .patch<Settings>(`/api/users/me/settings`, settingsPatch)
            .execute()
    }

    return (
        <>
            <p className="text-sm">
                {t("standard.mealcategory.description")}
            </p>

            <Spacer height="4" />

            {mealCategories.isLoading || settings.isLoading ? (
                <Spinner />
            ) : (
                <div className="space-y-2">
                    {mealCategories.data.map(category =>
                        <div key={category.id} className="flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="material-symbols-rounded outlined mr-4">{category.icon}</span>
                                {t(`global.mealcategory.${category.name}`)}
                            </div>
                            <IconButton onClick={() => handleSetStandardMealCategory(category)}>
                                {settings.data.standardMealCategory === category["@id"] ? "radio_button_checked" : "radio_button_unchecked"}
                            </IconButton>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
