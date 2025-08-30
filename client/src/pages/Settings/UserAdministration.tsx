import { InputWidget } from "@/components/form/InputWidget"
import { LabelledFormWidget } from "@/components/form/LabelledFormWidget"
import { SelectWidget } from "@/components/form/SelectWidget"
import { SwitchWidget } from "@/components/form/SwitchWidget"
import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Notification from "@/components/ui/Notification"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { AuthenticationContext } from "@/context/AuthenticationContext"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { useApiResource } from "@/hooks/useApiResource"
import { useApiResourceCollection } from "@/hooks/useApiResourceCollection"
import { useNullishContext } from "@/hooks/useNullishContext"
import useTimeout from "@/hooks/useTimeout"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { Role } from "@/types/api/Role"
import { User } from "@/types/api/User"
import { Authentication } from "@/types/Authentication"
import { PageState } from "@/types/enums/PageState"
import { SwitchValue } from "@/types/enums/SwitchValue"
import { UserAdministrationForm } from "@/types/forms/UserAdministrationForm"
import { GlobalAppData } from "@/types/GlobalAppData"
import { ManagedResource } from "@/types/ManagedResource"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { RoleOption } from "@/types/options/RoleOption"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import { hasRoleUserAdministration } from "@/util/auth/hasRoleUserAdministration"
import { getEntityOptions } from "@/util/forms/getEntityOptions"
import { getFormOptions } from "@/util/forms/getFormOptions"
import { ReactElement, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

type UserAdministrationRouteParams = {
    id?: string
}

export const UserAdministration = (): ReactElement => {
    const authentication: Authentication = useNullishContext(AuthenticationContext)
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const { userGroups }: Partial<GlobalAppData> = useNullishContext(GlobalAppDataContext)
    const { id }: UserAdministrationRouteParams = useParams()
    const user: ManagedResource<User> = useApiResource(`/api/users/${id}`, true)

    const roles: ManagedResourceCollection<Role> = useApiResourceCollection(`/api/roles`, true)
    const rolesOptions: RoleOption[] = getEntityOptions(roles, RoleOption)

    const [pageState, setPageState] = useState<PageState>(PageState.LOADING)
    const [formData, setFormData] = useState<UserAdministrationForm>({
        active: SwitchValue.OFF,
        email: "",
        roles: [],
        username: "",
    })

    const successTimeout = useTimeout(() => {
        setPageState(PageState.WAITING)
    }, 5000)

    useEffect(() => {
        if (user.isLoading || roles.isLoading || !hasRoleUserAdministration(authentication)) {
            return
        }

        setFormData({
            active: user.data.active ? SwitchValue.ON : SwitchValue.OFF,
            email: user.data.email ?? "",
            roles: user.data.roles,
            username: user.data.username ?? "",
        })

        setPageState(PageState.WAITING)
    }, [user.isLoading, roles.isLoading])

    useEffect(() => {
        sidebar.useDefault()

        topbar.configuration
              .title("Benutzer verwalten")
              .backButton({ isVisible: true, path: "/settings" })
              .mainViewWidth("md:w-[450px]")
              .rebuild()

        window.scrollTo(0, 0)
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        successTimeout.clearTimeout()

        if (user.isLoading) {
            return
        }

        setPageState(PageState.LOADING)

        const response: boolean = await ApiRequest.patch<User>(`/api/users/${id}`, {
            ...formData,
            active: formData.active === SwitchValue.ON,
        }).execute()

        if (response) {
            userGroups.load()
            successTimeout.startTimeout()
            setPageState(PageState.SUCCESS)
        } else {
            setPageState(PageState.ERROR)
        }
    }

    return (
        <StandardContentWrapper>
            {pageState === PageState.LOADING &&
                <Spinner />
            }

            {[PageState.WAITING, PageState.ERROR, PageState.SUCCESS].includes(pageState) &&
                <>
                    {pageState === PageState.SUCCESS &&
                        <>
                            <Notification color="green" title="Die Benutzerdaten wurden erfolgreich gespeichert.">

                            </Notification>
                            <Spacer height="6" />
                        </>
                    }

                    <form onSubmit={handleSubmit}>
                        <OuterCard>
                            <LabelledFormWidget
                                id="username"
                                label="Benutzername"
                                widget={
                                    <InputWidget
                                        field="username"
                                        formData={formData}
                                        setFormData={setFormData}
                                        required={true}
                                        placeholder="Benutzername"
                                    />
                                }
                            />

                            <Spacer height="6" />

                            <LabelledFormWidget
                                id="email"
                                label="Email-Adresse"
                                widget={
                                    <InputWidget
                                        field="email"
                                        formData={formData}
                                        setFormData={setFormData}
                                        placeholder="Email-Adresse"
                                    />
                                }
                            />

                            <Spacer height="6" />

                            <LabelledFormWidget
                                id="roles"
                                label="Rollen"
                                widget={
                                    <SelectWidget
                                        field="roles"
                                        formData={formData}
                                        setFormData={setFormData}
                                        multiple={true}
                                        required={true}
                                        options={getFormOptions(rolesOptions)}
                                        styleOverride={`dark:placeholder-secondary-dark-900 dark:bg-secondary-dark-200 border border-gray-300 dark:border-none rounded-md px-6 w-full transition duration-300 focus:border-primary-100 overflow-hidden`}
                                    />
                                }
                            />

                            <Spacer height="6" />

                            <SwitchWidget
                                field="active"
                                displayedText="Benutzer aktiv"
                                formData={formData}
                                setFormData={setFormData}
                                onClick={() => {
                                    setFormData({
                                        ...formData,
                                        active: formData.active === SwitchValue.OFF
                                            ? SwitchValue.ON
                                            : SwitchValue.OFF,
                                    })
                                }}
                            />
                        </OuterCard>

                        <div className="flex justify-end md:mt-4 pb-[5.5rem] md:pb-0">
                            {!user.isLoading &&
                                <Button
                                    type="submit"
                                    icon="save"
                                    label="Speichern"
                                    outlined={true}
                                    isElevated={true}
                                    isFloating={true}
                                />
                            }
                        </div>
                    </form>
                </>
            }
        </StandardContentWrapper>
    )
}
