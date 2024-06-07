import Card from '@/components/ui/Card'
import Heading from '@/components/ui/Heading'
import Spacer from '@/components/ui/Spacer'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import { TwoColumnView } from "@/components/ui/TwoColumnView"
import { MealCategorySettingsModule } from '@/pages/Settings/components/MealCategorySettingsModule'
import { PantrySettingsModule } from '@/pages/Settings/components/PantrySettingsModule'
import { UserGroupsSettingsModule } from '@/pages/Settings/components/UserGroupsSettingsModule'
import { UserListSettingsModule } from "@/pages/Settings/components/UserListSettingsModule"
import { UserSettingsSettingsModule } from '@/pages/Settings/components/UserSettingsSettingsModule'
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import DayModel from '@/types/DayModel'
import MealCategoryModel from '@/types/MealCategoryModel'
import SettingsModel from '@/types/SettingsModel'
import { UserGroupModel } from '@/types/UserGroupModel'
import React, { ReactElement, useEffect } from 'react'

export function Settings({ settings, userGroups, visibleUserGroups, mealCategories, days, authentication, setSidebar, setTopbar }: BasePageComponentProps & {
    settings: EntityState<SettingsModel>
    userGroups: EntityState<UserGroupModel[]>
    visibleUserGroups: EntityState<UserGroupModel[]>
    mealCategories: EntityState<MealCategoryModel[]>
    days: EntityState<DayModel[]>
    authentication: Authentication
}): ReactElement {
    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Einstellungen',
        })

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper className={"md:max-w-[900px]"}>
            <Heading size="xl" style="pl-2 mb-2">Benutzer</Heading>
            <Card>
                <UserListSettingsModule
                    authentication={authentication}
                />
            </Card>

            <Spacer height="10" />

            <TwoColumnView>
                <div>
                    <Heading size="xl" style="pl-2 mb-2">Benutzergruppen verwalten</Heading>
                    <Card>
                        <UserGroupsSettingsModule
                            userGroups={userGroups}
                            visibleUserGroups={visibleUserGroups}
                            days={days}
                            settings={settings}
                        />
                    </Card>
                </div>
                <div>
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

                    <Heading size="xl" style="pl-2 mb-2">Standardzeit für Mahlzeiten</Heading>
                    <Card>
                        <MealCategorySettingsModule
                            mealCategories={mealCategories}
                            settings={settings}
                        />
                    </Card>
                </div>
            </TwoColumnView>
        </StandardContentWrapper>
    )
}
