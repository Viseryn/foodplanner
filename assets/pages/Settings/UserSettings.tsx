import { InputWidget } from "@/components/form2/InputWidget"
import { LabelledFormWidget } from "@/components/form2/LabelledFormWidget"
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import useTimeout from "@/hooks/useTimeout"
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import { Form } from "@/types/forms/Form"
import { UserModel } from '@/types/UserModel'
import { tryApiRequest } from '@/util/tryApiRequest'
import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'

type UserSettingsProps = BasePageComponentProps & {
    user: EntityState<UserModel>
}

type UserSettingsForm = Form & {
    email?: string
    password?: string
}

export const UserSettings = (props: UserSettingsProps): ReactElement => {
    const { user, setSidebar, setTopbar } = props

    const [formData, setFormData] = useState<UserSettingsForm>({
        email: user.data?.email ?? '',
        password: '',
    })

    const successTimeout = useTimeout(() => {
        setSuccess(false)
    }, 5000)

    const [isLoading, setLoading] = useState<boolean>(false)
    const [isSuccess, setSuccess] = useState<boolean>(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setSuccess(false)
        successTimeout.clearTimeout()

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

        successTimeout.startTimeout()
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
                            <LabelledFormWidget
                                id={"email"}
                                label={"Email-Adresse"}
                                widget={
                                    <InputWidget
                                        field={"email"}
                                        formData={formData}
                                        setFormData={setFormData}
                                        type={"email"}
                                        maxLength={255}
                                    />
                                }
                            />

                            <LabelledFormWidget
                                id={"password"}
                                label={"Neues Passwort festlegen"}
                                widget={
                                    <InputWidget
                                        field={"password"}
                                        formData={formData}
                                        setFormData={setFormData}
                                        type={"password"}
                                    />
                                }
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
