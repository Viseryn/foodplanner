import { SwitchWidget } from "@/components/form/SwitchWidget"
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import { SwitchValue } from "@/lang/constants/SwitchValue"
import { Form } from "@/types/forms/Form"
import SettingsModel from '@/types/SettingsModel'
import { tryApiRequest } from '@/util/tryApiRequest'
import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'

const { ON, OFF } = SwitchValue;

type PantrySettingsModuleProps = {
    settings: EntityState<SettingsModel>
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

        const apiUrl: string = `/api/settings/${settings.data.id}`

        await tryApiRequest("PATCH", apiUrl, async (): Promise<AxiosResponse<SettingsModel>> => {
            const response: AxiosResponse<SettingsModel> = await axios.patch(apiUrl, {
                showPantry: !settings.data.showPantry
            })

            settings.setData(response.data)
            return response
        })
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
