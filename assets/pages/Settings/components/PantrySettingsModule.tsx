import React, { ReactElement } from 'react'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import SwitchRow from '@/components/form/Switch/SwitchRow'
import SettingsModel from '@/types/SettingsModel'
import { tryApiRequest } from '@/util/tryApiRequest'
import axios, { AxiosResponse } from 'axios'

type PantrySettingsModuleProps = {
    settings: EntityState<SettingsModel>
}

export const PantrySettingsModule = ({ settings }: PantrySettingsModuleProps): ReactElement => {
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
                <SwitchRow
                    id="showPantry"
                    label={'Vorratskammer wird ' + (!settings.data.showPantry ? 'nicht ' : '') + 'angezeigt'}
                    checked={settings.data.showPantry}
                    {...{
                        onClick: handlePantrySettings
                    }}
                />
            )}
        </>
    )
}
