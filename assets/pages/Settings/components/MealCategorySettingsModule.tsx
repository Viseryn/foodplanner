import React, { ReactElement } from 'react'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import IconButton from '@/components/ui/Buttons/IconButton'
import MealCategoryModel from '@/types/MealCategoryModel'
import SettingsModel from '@/types/SettingsModel'
import { tryApiRequest } from '@/util/tryApiRequest'
import axios, { AxiosResponse } from 'axios'

type MealCategorySettingsModuleProps = {
    mealCategories: EntityState<MealCategoryModel[]>
    settings: EntityState<SettingsModel>
}

export const MealCategorySettingsModule = (props: MealCategorySettingsModuleProps): ReactElement => {
    const { mealCategories, settings } = props

    const handleSetStandardMealCategory = async (mealCategory: MealCategoryModel): Promise<void> => {
        if (settings.isLoading) {
            return
        }

        const apiUrl: string = `/api/settings/${settings.data.id}`

        await tryApiRequest("PATCH", apiUrl, async (): Promise<AxiosResponse<SettingsModel>> => {
            const response: AxiosResponse<SettingsModel> = await axios.patch(apiUrl, {
                standardMealCategory: mealCategory
            })

            settings.setData(response.data)
            return response
        })
    }

    return (
        <>
            <p className="text-sm">
                Hier kannst du auswählen, welche Tageszeit standardmäßig für neue Mahlzeiten ausgewählt ist.
            </p>

            <Spacer height="4" />

            {mealCategories.isLoading || settings.isLoading ? (
                <Spinner />
            ) : (
                <div className="space-y-2">
                    {mealCategories.data.map((category, index) =>
                        <div key={category.id} className="flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="material-symbols-rounded outlined mr-4">{category.icon}</span>
                                {category.name}
                            </div>
                            <IconButton
                                outlined={settings.data.standardMealCategory?.id !== category.id}
                                onClick={() => handleSetStandardMealCategory(category)}>
                                favorite
                            </IconButton>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
