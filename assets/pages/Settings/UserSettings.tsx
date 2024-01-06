import React, { ReactElement, useEffect, useState } from 'react'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import Card from '@/components/ui/Card'
import { UserModel } from '@/types/UserModel'
import InputRow from '@/components/form/Input/InputRow'
import Button from '@/components/ui/Buttons/Button'
import { tryApiRequest } from '@/util/tryApiRequest'
import axios, { AxiosResponse } from 'axios'
import Spinner from '@/components/ui/Spinner'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'

type UserSettingsProps = {
    user: EntityState<UserModel>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}

type UserSettingsForm = {
    email?: string
    password?: string
}

export const UserSettings = (props: UserSettingsProps): ReactElement => {
    const { user, setSidebar, setTopbar } = props

    const [formData, setFormData] = useState<UserSettingsForm>({
        email: user.data?.email ?? '',
        password: '',
    })

    const [isLoading, setLoading] = useState<boolean>(false)
    const [isSuccess, setSuccess] = useState<boolean>(false)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData((prev: UserSettingsForm) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))

        setSuccess(false)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (user.isLoading) {
            return
        }

        setLoading(true)

        const apiUrl: string = `/api/users/${user.data.id}`
        const response: boolean = await tryApiRequest("PATCH", apiUrl, async (): Promise<AxiosResponse<UserModel>> => {
            const response: AxiosResponse<UserModel> = await axios.patch(apiUrl, formData)
            user.load()
            return response
        })

        if (response) {
            setSuccess(true)
            setFormData((prev: UserSettingsForm) => ({ ...prev, password: '' }))
        }

        setLoading(false)
    }

    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Benutzereinstellungen',
            showBackButton: true,
            backButtonPath: '/settings',
        })

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper className="md:max-w-[450px]">
            {isSuccess &&
                <>
                    <Notification color="green" title="Deine neuen Daten wurden erfolgreich gespeichert.">

                    </Notification>
                    <Spacer height="6" />
                </>
            }
            <form onSubmit={handleSubmit}>
                <Card style="flex flex-col gap-6">
                    <p className="text-sm">
                        Hier kannst du deine Email-Adresse eintragen (z.B. für den Fall, dass du dein Passwort
                        vergessen hast) und dein Passwort erneuern.
                    </p>

                    {isLoading ? (
                        <Spinner verticalMargin={10} />
                    ) : (
                        <>
                            <InputRow
                                id="email"
                                label="Email-Adresse"
                                {...{
                                    maxLength: 255,
                                    onChange: handleInputChange,
                                    name: 'email',
                                    value: formData.email,
                                }}
                            />

                            <InputRow
                                id="password"
                                label="Neues Passwort festlegen"
                                {...{
                                    maxLength: 255,
                                    onChange: handleInputChange,
                                    name: 'password',
                                    value: formData.password,
                                    type: 'password',
                                }}
                            />

                            <div />
                        </>
                    )}
                </Card>

                {!isLoading && (
                    <div className="flex justify-end md:mt-4 pb-[5.5rem] md:pb-0">
                        <Button
                            type="submit"
                            icon="save"
                            label="Speichern"
                            isElevated={true}
                            outlined={true}
                            isFloating={true}
                        />
                    </div>
                )}
            </form>
        </StandardContentWrapper>
    )
}
