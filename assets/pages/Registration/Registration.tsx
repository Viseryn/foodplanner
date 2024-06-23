import { InputWidget } from "@/components/form/InputWidget"
import { LabelledFormWidget } from "@/components/form/LabelledFormWidget"
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import { StandardContentWrapper } from '@/components/ui/StandardContentWrapper'
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import { RegistrationDto } from '@/types/datatransferobjects/RegistrationDto'
import { RegistrationForm } from "@/types/forms/RegistrationForm"
import { UserModel } from '@/types/UserModel'
import { tryApiRequest } from '@/util/tryApiRequest'
import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

type RegistrationProps = BasePageComponentProps & {
    authentication: Authentication
}

export const Registration = ({ authentication, setSidebar, setTopbar }: RegistrationProps): ReactElement => {
    const navigate: NavigateFunction = useNavigate()

    const [isLoading, setLoading] = useState<boolean>(true)
    const [isSuccess, setSuccess] = useState<boolean>(false)
    const [formData, setFormData] = useState<RegistrationForm>({
        username: '',
        password: '',
    })

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setLoading(true)

        const apiUrl: string = "/api/register"
        const response: boolean = await tryApiRequest("POST", apiUrl, async (): Promise<AxiosResponse<UserModel>> => {
            const dto: RegistrationDto = { ...formData, roles: ["ROLE_USER"] }
            return await axios.post(apiUrl, dto)
        })

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
    }, [authentication.isLoading]);

    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Registrierung',
        })
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
                    <Card>
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
                            id={"password"}
                            label={"Passwort"}
                            widget={
                                <InputWidget
                                    field={"password"}
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

                        <hr className="my-6 border-t-secondary-200 dark:border-t-secondary-dark-200" />

                        <p className="text-justify">
                            Nach der Registrierung muss deinem Account manuell der Admin-Status verliehen werden, ehe du
                            FoodPlanner nutzen kannst.
                        </p>

                        <Spacer height="4" />

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                icon="login"
                                label="Registrieren"
                                role="secondary"
                            />
                        </div>
                    </Card>
                </form>
            }
        </StandardContentWrapper>
    )
}
