import React, { ReactElement, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Heading from '@/components/ui/Heading'
import Spacer from '@/components/ui/Spacer'
import DayModel from '@/types/DayModel'
import MealCategoryModel from '@/types/MealCategoryModel'
import SettingsModel from '@/types/SettingsModel'
import { UserGroupModel } from '@/types/UserGroupModel'
import InstallationStatusModel from '@/types/InstallationStatusModel'
import { UserGroupsSettingsModule } from '@/pages/Settings/components/UserGroupsSettingsModule'
import { MealCategorySettingsModule } from '@/pages/Settings/components/MealCategorySettingsModule'
import { PantrySettingsModule } from '@/pages/Settings/components/PantrySettingsModule'
import { AppInformationSettingsModule } from '@/pages/Settings/components/AppInformationSettingsModule'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'

export function Settings({ settings, userGroups, mealCategories, days, setSidebar, setTopbar, installationStatus }: {
    settings: EntityState<SettingsModel>
    userGroups: EntityState<Array<UserGroupModel>>
    mealCategories: EntityState<Array<MealCategoryModel>>
    days: EntityState<Array<DayModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
    installationStatus: EntityState<InstallationStatusModel>
}): ReactElement {
    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Einstellungen',
        })

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper className={"md:w-[450px]"}>
            <Heading size="xl" style="pl-2 mb-2">Über FoodPlanner</Heading>
            <Card>
                <AppInformationSettingsModule
                    installationStatus={installationStatus}
                />
            </Card>

            <Spacer height="10" />

            <Heading size="xl" style="pl-2 mb-2">Vorratskammer anzeigen</Heading>
            <Card>
                <PantrySettingsModule
                    settings={settings}
                />
            </Card>

            <Spacer height="10" />

            <Heading size="xl" style="pl-2 mb-2">Benutzergruppen verwalten</Heading>
            <Card>
                <UserGroupsSettingsModule
                    userGroups={userGroups}
                    days={days}
                    settings={settings}
                />
            </Card>

            <Spacer height="10" />

            <Heading size="xl" style="pl-2 mb-2">Standardzeit für Mahlzeiten</Heading>
            <Card>
                <MealCategorySettingsModule
                    mealCategories={mealCategories}
                    settings={settings}
                />
            </Card>
        </StandardContentWrapper>
    )
}
