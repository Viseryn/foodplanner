import Card from '@/components/ui/Card'
import Heading from '@/components/ui/Heading'
import Spacer from '@/components/ui/Spacer'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import { AppInformationSettingsModule } from '@/pages/Settings/components/AppInformationSettingsModule'
import { MealCategorySettingsModule } from '@/pages/Settings/components/MealCategorySettingsModule'
import { PantrySettingsModule } from '@/pages/Settings/components/PantrySettingsModule'
import { UserGroupsSettingsModule } from '@/pages/Settings/components/UserGroupsSettingsModule'
import { UserSettingsSettingsModule } from '@/pages/Settings/components/UserSettingsSettingsModule'
import DayModel from '@/types/DayModel'
import InstallationStatusModel from '@/types/InstallationStatusModel'
import MealCategoryModel from '@/types/MealCategoryModel'
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import SettingsModel from '@/types/SettingsModel'
import { UserGroupModel } from '@/types/UserGroupModel'
import React, { ReactElement, useEffect } from 'react'

export function Settings({ settings, userGroups, visibleUserGroups, mealCategories, days, setSidebar, setTopbar, installationStatus }: BasePageComponentProps & {
    settings: EntityState<SettingsModel>
    userGroups: EntityState<UserGroupModel[]>
    visibleUserGroups: EntityState<UserGroupModel[]>
    mealCategories: EntityState<MealCategoryModel[]>
    days: EntityState<DayModel[]>
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

            <Heading size="xl" style="pl-2 mb-2">Benutzereinstellungen</Heading>
            <Card>
                <UserSettingsSettingsModule />
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
                    visibleUserGroups={visibleUserGroups}
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
