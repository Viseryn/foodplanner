import { InputWidget } from "@/components/form/InputWidget"
import { LabelledFormWidget } from "@/components/form/LabelledFormWidget"
import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Notification from "@/components/ui/Notification"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { UserContext } from "@/context/UserContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import useTimeout from "@/hooks/useTimeout"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { User } from "@/types/api/User"
import { Form } from "@/types/forms/Form"
import { ManagedResource } from "@/types/ManagedResource"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import { ReactElement, useEffect, useState } from "react"

type UserSettingsForm = Form & {
    email?: string
    plainPassword?: string
}

export const UserSettings = (): ReactElement => {
    const user: ManagedResource<User> = useNullishContext(UserContext)
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)

    const [formData, setFormData] = useState<UserSettingsForm>({
        email: user.data?.email ?? '',
        plainPassword: '',
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

        const response: boolean = await ApiRequest
            .patch<User>(`/api/users/me`, {
                ...(formData.email && { email: formData.email }),
                ...(formData.plainPassword && { plainPassword: formData.plainPassword }),
            })
            .ifSuccessful(() => user.load())
            .execute()

        if (response) {
            setSuccess(true)
            setFormData((prev: UserSettingsForm) => ({ ...prev, plainPassword: '' }))
        }

        setLoading(false)

        successTimeout.startTimeout()
    }

    useEffect(() => {
        sidebar.useDefault()

        topbar.configuration
              .title("Benutzereinstellungen")
              .backButton({ isVisible: true, path: "/settings" })
              .mainViewWidth("md:max-w-[450px]")
              .rebuild()

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper>
            {isSuccess &&
                <>
                    <Notification color="green" title="Deine neuen Daten wurden erfolgreich gespeichert.">

                    </Notification>
                    <Spacer height="6" />
                </>
            }
            <form onSubmit={handleSubmit}>
                <OuterCard className="flex flex-col gap-6">
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
                                id={"plainPassword"}
                                label={"Neues Passwort festlegen"}
                                widget={
                                    <InputWidget
                                        field={"plainPassword"}
                                        formData={formData}
                                        setFormData={setFormData}
                                        type={"password"}
                                    />
                                }
                            />

                            <div />
                        </>
                    )}
                </OuterCard>

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
