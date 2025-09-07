import IconButton from "@/components/ui/Buttons/IconButton"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { useTranslation } from "@/hooks/useTranslation"
import { SettingsTranslations } from "@/pages/Settings/SettingsTranslations"
import { Detached } from "@/types/api/Detached"
import { Settings } from "@/types/api/Settings"
import { HOMEPAGE_CONFIGS } from "@/types/constants/HOMEPAGE_CONFIGS"
import { Homepage } from "@/types/enums/Homepage"
import { HomepageConfig } from "@/types/enums/HomepageConfig"
import { ManagedResource } from "@/types/ManagedResource"
import { ApiRequest } from "@/util/ApiRequest"
import { ReactElement } from "react"

type HomePageOptionProps = {
    homepageConfig: HomepageConfig
    settings: ManagedResource<Settings>
}

type HomepageSettingsModuleProps = {
    settings: ManagedResource<Settings>
}

const handleSetHomepage = async (newHomepage: Homepage, settings: ManagedResource<Settings>): Promise<void> => {
    if (settings.isLoading) {
        return
    }

    const settingsPatch: Partial<Detached<Settings>> = { homepage: newHomepage }

    // Optimistic feedback
    settings.setData({ ...settings.data, ...settingsPatch })

    await ApiRequest
        .patch<Settings>(`/api/users/me/settings`, settingsPatch)
        .execute()
}

const HomepageOption = (props: HomePageOptionProps): ReactElement => {
    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <span className="material-symbols-rounded outlined mr-4">{props.homepageConfig.icon}</span>
                    {props.homepageConfig.label}
                </div>
                <IconButton onClick={() => handleSetHomepage(props.homepageConfig.homepage, props.settings)}>
                    {props.settings.data?.homepage === props.homepageConfig.homepage ? "radio_button_checked" : "radio_button_unchecked"}
                </IconButton>
            </div>
        </>
    )
}

export const HomepageSettingsModule = (props: HomepageSettingsModuleProps): ReactElement => {
    return (
        <>
            <p className="text-sm">
                {useTranslation(SettingsTranslations)("homepage.settings.description")}
            </p>

            <Spacer height="4" />

            {props.settings.isLoading ? (
                <Spinner />
            ) : (
                <div className="space-y-2">
                    {HOMEPAGE_CONFIGS.map((homepageConfig: HomepageConfig) => (
                        <HomepageOption
                            key={homepageConfig.page.id}
                            homepageConfig={homepageConfig}
                            settings={props.settings}
                        />
                    ))}
                </div>
            )}
        </>
    )
}