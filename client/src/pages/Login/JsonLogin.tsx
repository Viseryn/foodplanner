import { InputWidget } from "@/components/form/InputWidget"
import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Notification from "@/components/ui/Notification"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { AuthenticationContext } from "@/context/AuthenticationContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { UserContext } from "@/context/UserContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { User } from "@/types/api/User"
import { Authentication } from "@/types/Authentication"
import { PageState } from "@/types/enums/PageState"
import { ManagedResource } from "@/types/ManagedResource"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { apiClient } from "@/util/apiClient"
import { StringBuilder } from "@/util/StringBuilder"
import axios, { AxiosResponse } from "axios"
import { ReactElement, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

type JsonLoginForm = {
    username?: string
    password?: string
}

const formDataInitialState: JsonLoginForm = {
    username: "",
    password: "",
}

const errorStringBuilder: StringBuilder = new StringBuilder()

export const JsonLogin = (): ReactElement => {
    const authentication: Authentication = useNullishContext(AuthenticationContext)
    const user: ManagedResource<User> = useNullishContext(UserContext)
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)

    const [state, setState] = useState<PageState>(PageState.LOADING)
    const [formData, setFormData] = useState<JsonLoginForm>(formDataInitialState)

    const [isMascotJumping, setMascotJumping] = useState<boolean>(false)

    const handleJump = () => {
        if (isMascotJumping) {
            return
        }

        setMascotJumping(true)

        setTimeout(() => {
            setMascotJumping(false)
        }, 3000)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setState(PageState.LOADING)
        errorStringBuilder.clear()

        const apiUrl: string = "/api/login"

        try {
            const response: AxiosResponse = await apiClient.post(apiUrl, formData)
            setState(PageState.SUCCESS)
            user.load()

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
        if (authentication.isLoading) {
            return
        }

        setState(authentication.isAuthenticated ? PageState.SUCCESS : PageState.WAITING)
    }, [authentication.isAuthenticated, authentication.isLoading])

    useEffect(() => {
        sidebar.useDefault()
        topbar.useDefault("FoodPlanner")
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
                <Navigate to="/" />
            }

            {[PageState.WAITING, PageState.ERROR].includes(state) &&
                <>
                    <Spacer height={6} />

                    <img src="/img/icons/192-transparent.png" className={StringBuilder.cn(
                        "w-32 h-32 mx-auto transition duration-300",
                        [isMascotJumping, "animate-jump"],
                    )} onClick={handleJump} alt="FoodPlanner" />

                    <Spacer height={12} />

                    <OuterCard className="!rounded-3xl">
                        <form onSubmit={handleSubmit}>
                            <div className="rounded-t-3xl rounded-b-md font-semibold bg-white dark:bg-secondary-dark-200 h-14 flex items-center pl-6 pr-4">
                                <span className="material-symbols-rounded mr-2 cursor-default">
                                    account_circle
                                </span>

                                <InputWidget
                                    field={"username"}
                                    formData={formData}
                                    setFormData={setFormData}
                                    placeholder={"Benutzername"}
                                    required={true}
                                    styleOverride={`bg-white dark:bg-secondary-dark-200 placeholder-secondary-900 dark:placeholder-secondary-dark-900 w-full border-transparent focus:border-transparent focus:ring-0`}
                                />
                            </div>

                            <Spacer height={1} />

                            <div className="rounded-full rounded-t-md rounded-b-3xl font-semibold bg-white dark:bg-secondary-dark-200 h-14 flex items-center pl-6 pr-4">
                                <span className="material-symbols-rounded mr-2 cursor-default">
                                    key
                                </span>

                                <InputWidget
                                    field={"password"}
                                    type={"password"}
                                    formData={formData}
                                    setFormData={setFormData}
                                    placeholder={"Passwort"}
                                    required={true}
                                    styleOverride={`bg-white dark:bg-secondary-dark-200 placeholder-secondary-900 dark:placeholder-secondary-dark-900 w-full border-transparent focus:border-transparent focus:ring-0`}
                                />
                            </div>

                            <Spacer height={6} />

                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    icon="login"
                                    label="Anmelden"
                                    role="primary"
                                />
                            </div>
                        </form>
                    </OuterCard>

                    <Spacer height={12} />

                    <div className="flex justify-center">
                        <Button
                            location="#"
                            label="Passwort vergessen?"
                            role="tertiary"
                            isSmall={true}
                            onClick={handleResetPassword}
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

const handleResetPassword = (): void => {
    void swal({
        dangerMode: true,
        icon: "error",
        title: "Passwort zurücksetzen",
        text: "Diese Funktion ist momentan nicht verfügbar.",
    })
}
