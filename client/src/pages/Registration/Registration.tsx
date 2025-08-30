import { InputWidget } from "@/components/form/InputWidget"
import { LabelledFormWidget } from "@/components/form/LabelledFormWidget"
import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Notification from "@/components/ui/Notification"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { AuthenticationContext } from "@/context/AuthenticationContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { Authentication } from "@/types/Authentication"
import { RegistrationForm } from "@/types/forms/RegistrationForm"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import React, { ReactElement, useEffect, useState } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"

export const Registration = (): ReactElement => {
    const authentication: Authentication = useNullishContext(AuthenticationContext)
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const navigate: NavigateFunction = useNavigate()

    const [isLoading, setLoading] = useState<boolean>(true)
    const [isSuccess, setSuccess] = useState<boolean>(false)
    const [formData, setFormData] = useState<RegistrationForm>({
        username: '',
        plainPassword: '',
    })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setLoading(true)

        const response: boolean = await new ApiRequest("POST", "/api/users", formData).execute()

        if (response) {
            setSuccess(true)
        }

        setLoading(false)
    }

    useEffect(() => {
        if (authentication.isLoading) {
            return
        }

        if (authentication.isAuthenticated) {
            navigate("/login")
        }

        setLoading(false)
    }, [authentication.isLoading])

    useEffect(() => {
        sidebar.useDefault()
        topbar.configuration
            .title("Registrieren")
            .backButton({ isVisible: true, path: "/login" })
            .rebuild()
    }, [])

    return (
        <StandardContentWrapper className="md:w-[400px]">
            {isSuccess &&
                <>
                    <Notification color="green" title="Deine Registrierung war erfolgreich!" />
                    <Spacer height="10" />
                    <div className="flex justify-center">
                        <Button
                            role="secondary"
                            icon="login"
                            label="Zum Login"
                            location="/login"
                        />
                    </div>
                </>
            }

            {isLoading &&
                <Spinner />
            }

            {!isSuccess && !isLoading &&
                <form onSubmit={handleSubmit} autoComplete="off">
                    <OuterCard>
                        <LabelledFormWidget
                            id={"username"}
                            label={"Benutzername"}
                            widget={
                                <InputWidget
                                    field={"username"}
                                    formData={formData}
                                    setFormData={setFormData}
                                    required={true}
                                />
                            }
                        />

                        <Spacer height="6" />

                        <LabelledFormWidget
                            id={"plainPassword"}
                            label={"Passwort"}
                            widget={
                                <InputWidget
                                    field={"plainPassword"}
                                    formData={formData}
                                    setFormData={setFormData}
                                    required={true}
                                    type={"password"}
                                />
                            }
                        />

                        <Spacer height="6" />

                        {/* @todo Uncomment when ToS or privacy stuff gets important. */}
                        {/*<div className="flex items-center">*/}
                        {/*    <input*/}
                        {/*        id="agreeTerms"*/}
                        {/*        name="registration_form[agreeTerms]"*/}
                        {/*        type="checkbox"*/}
                        {/*        required={true}*/}
                        {/*        className="w-4 h-4 mr-4 text-primary-100 bg-[#e0e4d6] rounded-sm border border-[#c3c8bb] dark:bg-[#43483e] dark:border-[#8d9286] focus:ring-primary-100 focus:ring-2 peer"*/}
                        {/*    />*/}
                        {/*    <label htmlFor="agreeTerms">*/}
                        {/*        Ich stimme den Nutzungsbedingungen und den Datenschutzbestimmungen zu.*/}
                        {/*    </label>*/}
                        {/*</div>*/}

                        <Notification>
                            Nach der Registrierung muss dein Account von einem Administrator freigeschaltet werden, ehe du
                            FoodPlanner nutzen kannst.
                        </Notification>

                        <Spacer height="6" />

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                icon="login"
                                label="Registrieren"
                                role="secondary"
                            />
                        </div>
                    </OuterCard>
                </form>
            }
        </StandardContentWrapper>
    )
}
