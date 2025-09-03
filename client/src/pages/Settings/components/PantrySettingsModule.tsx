import { SwitchWidget } from "@/components/form/SwitchWidget"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { TranslationFunction, useTranslation } from "@/hooks/useTranslation"
import { SettingsTranslations } from "@/pages/Settings/SettingsTranslations"
import { Settings } from "@/types/api/Settings"
import { SwitchValue } from "@/types/enums/SwitchValue"
import { Form } from "@/types/forms/Form"
import { ManagedResource } from "@/types/ManagedResource"
import { ApiRequest } from "@/util/ApiRequest"
import { ReactElement, useEffect, useState } from "react"

const { ON, OFF } = SwitchValue

type PantrySettingsModuleProps = {
    settings: ManagedResource<Settings>
}

export const PantrySettingsModule = ({ settings }: PantrySettingsModuleProps): ReactElement => {
    const t: TranslationFunction = useTranslation(SettingsTranslations)

    const [formData, setFormData]
        = useState<Form & { showPantry: SwitchValue }>({ showPantry: OFF })

    useEffect(() => {
        if (settings.isLoading) {
            return
        }

        setFormData({ showPantry: !!settings.data.showPantry ? ON : OFF })
    }, [settings.isLoading, settings.data])

    const handlePantrySettings = async (): Promise<void> => {
        if (settings.isLoading) {
            return
        }

        await ApiRequest
            .patch<Settings>(`/api/users/me/settings`, { showPantry: !settings.data.showPantry })
            .ifSuccessful(settings.setData)
            .execute()
    }

    return (
        <>
            <p className="text-sm">
                {t("show.pantry.settings.description")}
            </p>

            <Spacer height="4" />

            {settings.isLoading ? (
                <Spinner />
            ) : (
                <span onClick={handlePantrySettings}>
                    <SwitchWidget
                        field={"showPantry"}
                        displayedText={settings.data.showPantry ? t("show.pantry.switch.label.true") : t("show.pantry.switch.label.false")}
                        formData={formData}
                        setFormData={setFormData}
                    />
                </span>
            )}
        </>
    )
}
