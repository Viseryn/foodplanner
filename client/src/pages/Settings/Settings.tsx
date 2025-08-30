import { CardHeading } from "@/components/ui/Cards/CardHeading"
import { CollapsibleCard } from "@/components/ui/Cards/CollapsibleCard"
import { InnerCard } from "@/components/ui/Cards/InnerCard"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Spacer from "@/components/ui/Spacer"
import { AuthenticationContext } from "@/context/AuthenticationContext"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SettingsContext } from "@/context/SettingsContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { useScrollCache } from "@/hooks/useScrollCache"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { AppInformationSettingsModule } from "@/pages/Settings/components/AppInformationSettingsModule"
import { HomepageSettingsModule } from "@/pages/Settings/components/HomepageSettingsModule"
import { MealCategorySettingsModule } from "@/pages/Settings/components/MealCategorySettingsModule"
import { PantrySettingsModule } from "@/pages/Settings/components/PantrySettingsModule"
import { UserGroupsSettingsModule } from "@/pages/Settings/components/UserGroupsSettingsModule"
import { UserListSettingsModule } from "@/pages/Settings/components/UserListSettingsModule"
import { UserSettingsSettingsModule } from "@/pages/Settings/components/UserSettingsSettingsModule"
import { Settings as SettingsApiResource } from "@/types/api/Settings"
import { Authentication } from "@/types/Authentication"
import { GlobalAppData } from "@/types/GlobalAppData"
import { ManagedResource } from "@/types/ManagedResource"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ReactElement, useEffect } from "react"

export function Settings(): ReactElement {
    const authentication: Authentication = useNullishContext(AuthenticationContext)
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const settings: ManagedResource<SettingsApiResource> = useNullishContext(SettingsContext)
    const { meals, userGroups, visibleUserGroups, mealCategories }: Partial<GlobalAppData> = useNullishContext(GlobalAppDataContext)

    useScrollCache("settings")

    useEffect(() => {
        sidebar.useDefault()
        topbar.useDefault("Einstellungen")
    }, [])

    return (
        <StandardContentWrapper className={"md:max-w-[700px]"}>
            <OuterCard>
                <CardHeading size="text-xl">Persönliche Einstellungen</CardHeading>

                <Spacer height="4" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">Benutzereinstellungen</CardHeading>,
                }}>
                    <UserSettingsSettingsModule />
                </CollapsibleCard>

                <Spacer height="6" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">Vorratskammer anzeigen</CardHeading>,
                }}>
                    <PantrySettingsModule
                        settings={settings}
                    />
                </CollapsibleCard>

                <Spacer height="6" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">Standardzeit für Mahlzeiten</CardHeading>,
                }}>
                    <MealCategorySettingsModule
                        mealCategories={mealCategories}
                        settings={settings}
                    />
                </CollapsibleCard>

                <Spacer height="6" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">Startseite</CardHeading>,
                }}>
                    <HomepageSettingsModule
                        settings={settings}
                    />
                </CollapsibleCard>
            </OuterCard>

            <Spacer height="6" />

            <OuterCard>
                <CardHeading size="text-xl" className="ml-2">Systemverwaltung</CardHeading>

                <Spacer height="4" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">Benutzergruppen verwalten</CardHeading>,
                }}>
                    <UserGroupsSettingsModule
                        userGroups={userGroups}
                        visibleUserGroups={visibleUserGroups}
                        meals={meals}
                        settings={settings}
                    />
                </CollapsibleCard>

                <Spacer height="6" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">Benutzer verwalten</CardHeading>,
                }}>
                    <UserListSettingsModule
                        authentication={authentication}
                    />
                </CollapsibleCard>

                <Spacer height="6" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">Versionsinformationen</CardHeading>,
                }}>
                    <AppInformationSettingsModule />
                </CollapsibleCard>
            </OuterCard>
        </StandardContentWrapper>
    )
}
