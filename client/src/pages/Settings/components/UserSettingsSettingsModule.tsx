import Button from "@/components/ui/Buttons/Button"
import Spacer from "@/components/ui/Spacer"
import { ReactElement } from "react"

export const UserSettingsSettingsModule = (): ReactElement => (
    <>
        <p className="text-sm">
            Hier kannst du deine Email-Adresse eintragen (z.B. für den Fall, dass du dein Passwort
            vergessen hast) und dein Passwort erneuern.
        </p>

        <Spacer height="6" />

        <Button
            role="secondary"
            location="/settings/user"
            label="Benutzereinstellungen öffnen"
            icon="settings_account_box"
        />
    </>
)
