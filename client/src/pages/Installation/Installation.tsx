import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Heading from "@/components/ui/Heading"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { AppContext } from "@/context/AppContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { InstallationStatus } from "@/types/api/InstallationStatus"
import { PageState } from "@/types/enums/PageState"
import { RegistrationForm } from "@/types/forms/RegistrationForm"
import { ManagedResource } from "@/types/ManagedResource"
import { ApiRequest } from "@/util/ApiRequest"
import { ReactElement, useState } from "react"
import { Navigate } from "react-router-dom"

export const Installation = (): ReactElement => {
    const installationStatus: ManagedResource<InstallationStatus> = useNullishContext(AppContext).installationData.installation

    const [state, setState] = useState<PageState>(PageState.WAITING)
    const [formData, setFormData] = useState<RegistrationForm>({
        username: "",
        plainPassword: "",
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData((prev: RegistrationForm) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setState(PageState.LOADING)

        const registrationResponse: boolean = await new ApiRequest("POST", "/api/users", formData).execute()

        if (registrationResponse) {
            const installResponse: boolean = await new ApiRequest("POST", "/api/install").execute()

            if (installResponse) {
                installationStatus.load()
                setState(PageState.SUCCESS)
            } else {
                setState(PageState.ERROR)
            }
        } else {
            setState(PageState.ERROR)
        }
    }

    return (
        <StandardContentWrapper className="md:ml-4 md:max-w-[450px]">
            <Heading style="ml-2">FoodPlanner einrichten</Heading>

            <Spacer height={6} />

            {state === PageState.LOADING &&
                <Spinner />
            }

            {state === PageState.SUCCESS &&
                <Navigate to="/login" />
            }

            {[PageState.WAITING, PageState.ERROR].includes(state) &&
                <form onSubmit={handleSubmit} autoComplete="off">
                    <OuterCard className="!rounded-3xl">
                        <Heading size="lg">Willkommen im FoodPlanner!</Heading>
                        <Spacer height={4} />
                        <p>Bevor du FoodPlanner nutzen kannst, musst
                            du zunächst einen Hauptnutzer anlegen. Bitte wähle ein sicheres Passwort.
                            Du kannst nach der initialen Einrichtung auch noch weitere Benutzer anlegen, mit denen
                            du FoodPlanner gleichzeitig nutzen kannst.</p>
                        <Spacer height={4} />
                        <p>Nach Abschluss der Einrichtung kannst du dich einloggen und loslegen!</p>

                        <hr className="my-6 border-t-secondary-200 dark:border-t-secondary-dark-200" />

                        <div className="rounded-full font-semibold bg-secondary-200 dark:bg-secondary-dark-200 h-14 flex items-center pl-6 pr-4">
                            <span className="material-symbols-rounded mr-2 cursor-default">
                                account_circle
                            </span>

                            <input
                                className="bg-secondary-200 dark:bg-secondary-dark-200 placeholder-secondary-900 dark:placeholder-secondary-dark-900 w-full border-transparent focus:border-transparent focus:ring-0"
                                placeholder="Dein Benutzername"
                                type="text"
                                id="username"
                                name="username"
                                required={true}
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </div>

                        <Spacer height={6} />

                        <div className="rounded-full font-semibold bg-secondary-200 dark:bg-secondary-dark-200 h-14 flex items-center pl-6 pr-4">
                            <span className="material-symbols-rounded mr-2 cursor-default">
                                key
                            </span>

                            <input
                                className="bg-secondary-200 dark:bg-secondary-dark-200 placeholder-secondary-900 dark:placeholder-secondary-dark-900 w-full border-transparent focus:border-transparent focus:ring-0"
                                placeholder="Dein Passwort"
                                type="password"
                                id="plainPassword"
                                name="plainPassword"
                                required={true}
                                value={formData.plainPassword}
                                onChange={handleInputChange}
                            />
                        </div>

                        <Spacer height={6} />

                        <div className="flex items-center">
                            <input
                                id="agreeTerms"
                                name="agreeTerms"
                                type="checkbox"
                                required={true}
                                className="w-4 h-4 mr-4 text-primary-100 bg-[#e0e4d6] rounded-sm border border-[#c3c8bb] dark:bg-[#43483e] dark:border-[#8d9286] focus:ring-primary-100 focus:ring-2 peer"
                            />
                            <label htmlFor="registration_form_agreeTerms">
                                Ich stimme den Nutzungsbedingungen und den
                                Datenschutzbestimmungen zu.
                            </label>
                        </div>

                        <Spacer height={6} />

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                icon="login"
                                label="Einrichtung abschließen"
                                role="primary"
                            />
                        </div>
                    </OuterCard>
                </form>
            }
        </StandardContentWrapper>
    )
}
