import Button from "@/components/ui/Buttons/Button"
import Spacer from "@/components/ui/Spacer"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { SettingsTranslations } from "@/pages/Settings/SettingsTranslations"
import { ReactElement } from "react"

export const UserSettingsSettingsModule = (): ReactElement => {
    const t: TranslationFunction = useTranslation(SettingsTranslations)

    return (
        <>
            <p className="text-sm">
                {t("user.settings.description")}
            </p>

            <Spacer height="6" />

            <Button
                role="secondary"
                location="/settings/user"
                label={t("user.settings.button")}
                icon="settings_account_box"
            />
        </>
    )
}
