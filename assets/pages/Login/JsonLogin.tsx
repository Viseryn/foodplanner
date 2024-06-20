import { InputWidget } from "@/components/form/InputWidget"
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import { PageState } from '@/types/enums/PageState'
import { UserModel } from '@/types/UserModel'
import { StringBuilder } from '@/util/StringBuilder'
import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

type JsonLoginProps = BasePageComponentProps & {
    user: EntityState<UserModel>
    authentication: Authentication
}

type JsonLoginForm = {
    username?: string
    password?: string
}

const formDataInitialState: JsonLoginForm = {
    username: "",
    password: "",
}

const errorStringBuilder: StringBuilder = new StringBuilder()

export const JsonLogin = (props: JsonLoginProps): ReactElement => {
    const [state, setState] = useState<PageState>(PageState.LOADING)
    const [formData, setFormData] = useState<JsonLoginForm>(formDataInitialState)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setState(PageState.LOADING)
        errorStringBuilder.clear()

        const apiUrl: string = "/api/login"

        try {
            const response: AxiosResponse = await axios.post(apiUrl, formData)
            setState(PageState.SUCCESS)
            props.user.load()

            errorStringBuilder
                .append(`[INFO] (POST ${apiUrl}): ${response?.request?.status}`)
                .blank()
                .append(`${response?.request?.statusText}`)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setState(PageState.ERROR)
                setFormData(formDataInitialState)

                errorStringBuilder
                    .append(`[ERROR] (POST ${apiUrl}): ${error?.response?.request?.status}`)
                    .blank()
                    .append(`${error?.response?.request?.statusText}.`)
                    .newLine()
                    .append(`${error?.response?.data?.error}`)
            }
        } finally {
            errorStringBuilder.logToConsole()
        }
    }

    useEffect(() => {
        if (props.authentication.isLoading) {
            return
        }

        setState(props.authentication.isAuthenticated ? PageState.SUCCESS : PageState.WAITING)
    }, [props.authentication.isAuthenticated, props.authentication.isLoading]);

    useEffect(() => {
        props.setSidebar()
        props.setTopbar({ title: "Login" })
    }, [])

    return (
        <StandardContentWrapper className="md:w-[450px]">
            {state === PageState.LOADING &&
                <Spinner />
            }

            {state === PageState.ERROR &&
                <>
                    <Notification color="red" title="Login nicht erfolgreich.">
                        Folgende Fehlermeldung wurde vom Server zurückgegeben: <em>{errorStringBuilder?.getLast()}</em>
                    </Notification>

                    <Spacer height={6} />
                </>
            }

            {state === PageState.SUCCESS &&
                <Navigate to="/planner" />
            }

            {[PageState.WAITING, PageState.ERROR].includes(state) &&
                <>
                    <Card style="!rounded-3xl">
                        <form onSubmit={handleSubmit}>
                            <div className="rounded-full font-semibold bg-secondary-200 dark:bg-secondary-dark-200 h-14 flex items-center pl-6 pr-4">
                                <span className="material-symbols-rounded mr-2 cursor-default">
                                    account_circle
                                </span>

                                <InputWidget
                                    field={"username"}
                                    formData={formData}
                                    setFormData={setFormData}
                                    placeholder={"Dein Benutzername"}
                                    required={true}
                                    styleOverride={`bg-secondary-200 dark:bg-secondary-dark-200 placeholder-secondary-900 dark:placeholder-secondary-dark-900 w-full border-transparent focus:border-transparent focus:ring-0`}
                                />
                            </div>

                            <Spacer height={6} />

                            <div className="rounded-full font-semibold bg-secondary-200 dark:bg-secondary-dark-200 h-14 flex items-center pl-6 pr-4">
                                <span className="material-symbols-rounded mr-2 cursor-default">
                                    key
                                </span>

                                <InputWidget
                                    field={"password"}
                                    type={"password"}
                                    formData={formData}
                                    setFormData={setFormData}
                                    placeholder={"Dein Passwort"}
                                    required={true}
                                    styleOverride={`bg-secondary-200 dark:bg-secondary-dark-200 placeholder-secondary-900 dark:placeholder-secondary-dark-900 w-full border-transparent focus:border-transparent focus:ring-0`}
                                />
                            </div>

                            <Spacer height={6} />

                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    icon="login"
                                    label="Einloggen"
                                    role="primary"
                                />
                            </div>
                        </form>
                    </Card>

                    <Spacer height={20} />

                    <div className="flex justify-center">
                        <Button
                            location="#"
                            label="Passwort vergessen?"
                            role="tertiary"
                            isSmall={true}
                        />
                    </div>
                    <Spacer height={4} />
                    <div className="flex justify-center">
                        <Button
                            location="/register"
                            label="Neuen Account erstellen"
                            role="tertiary"
                            isSmall={true}
                        />
                    </div>
                </>
            }
        </StandardContentWrapper>
    )
}
