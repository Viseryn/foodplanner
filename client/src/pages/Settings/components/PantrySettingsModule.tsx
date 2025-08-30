import { SwitchWidget } from "@/components/form/SwitchWidget"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
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
                Hier kannst du auswählen, ob die Vorratskammer in der Navigationsleiste (links bzw. unten) angezeigt
                werden soll oder nicht. Damit verbundene Funktionen werden dann ebenfalls ein- oder ausgeblendet.
            </p>

            <Spacer height="4" />

            {settings.isLoading ? (
                <Spinner />
            ) : (
                <span onClick={handlePantrySettings}>
                    <SwitchWidget
                        field={"showPantry"}
                        displayedText={`Vorratskammer wird ${!settings.data.showPantry ? "nicht angezeigt" : "angezeigt"}`}
                        formData={formData}
                        setFormData={setFormData}
                    />
                </span>
            )}
        </>
    )
}
