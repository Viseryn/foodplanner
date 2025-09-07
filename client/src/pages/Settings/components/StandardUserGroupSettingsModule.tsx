import IconButton from "@/components/ui/Buttons/IconButton"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { SettingsTranslations } from "@/pages/Settings/SettingsTranslations"
import { Detached } from "@/types/api/Detached"
import { Settings } from "@/types/api/Settings"
import { UserGroup } from "@/types/api/UserGroup"
import { ManagedResource } from "@/types/ManagedResource"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { ApiRequest } from "@/util/ApiRequest"
import { ReactElement } from "react"

type StandardUserGroupSettingsModuleProps = {
    userGroups: ManagedResourceCollection<UserGroup>
    settings: ManagedResource<Settings>
}

export const StandardUserGroupSettingsModule = (props: StandardUserGroupSettingsModuleProps): ReactElement => {
    const { userGroups, settings } = props

    const t: TranslationFunction = useTranslation(SettingsTranslations)

    const handleSetStandardUserGroup = async (userGroup: UserGroup): Promise<void> => {
        if (settings.isLoading) {
            return
        }

        const settingsPatch: Partial<Detached<Settings>> = { standardUserGroup: userGroup["@id"] }

        // Optimistic feedback
        settings.setData({ ...settings.data, ...settingsPatch })

        await ApiRequest
            .patch<Settings>(`/api/users/me/settings`, settingsPatch)
            .execute()
    }

    return (
        <>
            <p className="text-sm">
                {t("standard.usergroup.description")}
            </p>

            <Spacer height="4" />

            {userGroups.isLoading || settings.isLoading ? (
                <Spinner />
            ) : (
                <div className="space-y-2">
                    {userGroups.data.map(userGroup =>
                        <div key={userGroup.id} className="flex justify-between items-center">
                            <div className="flex items-center">
                                <span className="material-symbols-rounded outlined mr-4">{userGroup.icon}</span>
                                {userGroup.name === "Alle" ? t(`global.usergroup.${userGroup.name}`) : userGroup.name}
                            </div>
                            <IconButton onClick={() => handleSetStandardUserGroup(userGroup)}>
                                {settings.data.standardUserGroup === userGroup["@id"] ? "radio_button_checked" : "radio_button_unchecked"}
                            </IconButton>
                        </div>,
                    )}
                </div>
            )}
        </>
    )
}
