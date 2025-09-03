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
import { stateCacheStore, useStateCache } from "@/hooks/useStateCache"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { AppInformationSettingsModule } from "@/pages/Settings/components/AppInformationSettingsModule"
import { HomepageSettingsModule } from "@/pages/Settings/components/HomepageSettingsModule"
import { MealCategorySettingsModule } from "@/pages/Settings/components/MealCategorySettingsModule"
import { PantrySettingsModule } from "@/pages/Settings/components/PantrySettingsModule"
import { StandardUserGroupSettingsModule } from "@/pages/Settings/components/StandardUserGroupSettingsModule"
import { UserGroupsSettingsModule } from "@/pages/Settings/components/UserGroupsSettingsModule"
import { UserListSettingsModule } from "@/pages/Settings/components/UserListSettingsModule"
import { UserSettingsSettingsModule } from "@/pages/Settings/components/UserSettingsSettingsModule"
import { SettingsTranslations } from "@/pages/Settings/SettingsTranslations"
import { Settings as SettingsApiResource } from "@/types/api/Settings"
import { Authentication } from "@/types/Authentication"
import { GlobalAppData } from "@/types/GlobalAppData"
import { ManagedResource } from "@/types/ManagedResource"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ReactElement, useCallback, useEffect } from "react"

export function Settings(): ReactElement {
    const t: TranslationFunction = useTranslation(SettingsTranslations)
    const authentication: Authentication = useNullishContext(AuthenticationContext)
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const settings: ManagedResource<SettingsApiResource> = useNullishContext(SettingsContext)
    const { meals, userGroups, visibleUserGroups, mealCategories }: Partial<GlobalAppData> = useNullishContext(GlobalAppDataContext)

    const systemSettingsCollapsed: boolean = useStateCache(state => state.systemSettingsCollapsed)
    const toggleSystemSettingsCollapsed = useCallback((): void => {
        stateCacheStore.getState().toggle("systemSettingsCollapsed")
    }, [])

    useScrollCache("settings")

    useEffect(() => {
        sidebar.useDefault()
        topbar.useDefault(t("topbar.title"))
    }, [])

    return (
        <StandardContentWrapper className={"md:max-w-[700px]"}>
            <OuterCard>
                <CardHeading size="text-xl">{t("personal.settings.card.title")}</CardHeading>

                <Spacer height="4" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">{t("user.settings.card.title")}</CardHeading>,
                }}>
                    <UserSettingsSettingsModule />
                </CollapsibleCard>

                <Spacer height="6" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">{t("homepage.settings.card.title")}</CardHeading>,
                }}>
                    <HomepageSettingsModule
                        settings={settings}
                    />
                </CollapsibleCard>

                <Spacer height="6" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">{t("show.pantry.settings.card.title")}</CardHeading>,
                }}>
                    <PantrySettingsModule
                        settings={settings}
                    />
                </CollapsibleCard>

                <Spacer height="6" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">{t("standard.mealcategory.card.title")}</CardHeading>,
                }}>
                    <MealCategorySettingsModule
                        mealCategories={mealCategories}
                        settings={settings}
                    />
                </CollapsibleCard>

                <Spacer height="6" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">{t("standard.usergroup.card.title")}</CardHeading>,
                }}>
                    <StandardUserGroupSettingsModule
                        userGroups={visibleUserGroups}
                        settings={settings}
                    />
                </CollapsibleCard>
            </OuterCard>

            <Spacer height="6" />

            <CollapsibleCard
                cardComponent={OuterCard}
                heading={<CardHeading size="text-xl" className="ml-2">{t("system.settings.card.title")}</CardHeading>}
                collapsed={systemSettingsCollapsed}
                onCollapse={toggleSystemSettingsCollapsed}
            >
                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">{t("usergroups.card.title")}</CardHeading>,
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
                    heading: <CardHeading size="text-md" className="font-bold">{t("users.card.title")}</CardHeading>,
                }}>
                    <UserListSettingsModule
                        authentication={authentication}
                    />
                </CollapsibleCard>

                <Spacer height="6" />

                <CollapsibleCard {...{
                    cardComponent: InnerCard,
                    heading: <CardHeading size="text-md" className="font-bold">{t("version.info.card.title")}</CardHeading>,
                }}>
                    <AppInformationSettingsModule />
                </CollapsibleCard>
            </CollapsibleCard>
        </StandardContentWrapper>
    )
}
