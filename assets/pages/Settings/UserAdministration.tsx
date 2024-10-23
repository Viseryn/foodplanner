import { InputWidget } from "@/components/form/InputWidget"
import { LabelledFormWidget } from "@/components/form/LabelledFormWidget"
import { SelectWidget } from "@/components/form/SelectWidget"
import { SwitchWidget } from "@/components/form/SwitchWidget"
import Button from "@/components/ui/Buttons/Button"
import Card from "@/components/ui/Card"
import Notification from "@/components/ui/Notification"
import Spacer from "@/components/ui/Spacer"
import Spinner from "@/components/ui/Spinner"
import { StandardContentWrapper } from "@/components/ui/StandardContentWrapper"
import { useEntityState } from "@/hooks/useEntityState"
import useTimeout from "@/hooks/useTimeout"
import { SwitchValue } from "@/lang/constants/SwitchValue"
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import { PageState } from "@/types/enums/PageState"
import { UserAdministrationForm } from "@/types/forms/UserAdministrationForm"
import { RoleOption } from "@/types/options/RoleOption"
import { Role } from "@/types/Role"
import { UserGroupModel } from "@/types/UserGroupModel"
import { UserModel } from "@/types/UserModel"
import { hasRoleUserAdministration } from "@/util/auth/hasRoleUserAdministration"
import { getEntityOptions } from "@/util/forms/getEntityOptions"
import { getFormOptions } from "@/util/forms/getFormOptions"
import { tryApiRequest } from "@/util/tryApiRequest"
import axios from "axios"
import React, { ReactElement, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

type UserAdministrationProps = BasePageComponentProps & {
    authentication: Authentication
    userGroups: EntityState<UserGroupModel[]>
}

type UserAdministrationRouteParams = {
    id?: string
}

export const UserAdministration = (props: UserAdministrationProps): ReactElement => {
    const { id }: UserAdministrationRouteParams = useParams()
    const user: EntityState<UserModel> = useEntityState(`/api/users/${id}`, props.authentication)

    const roles: EntityState<Role[]> = useEntityState(`/api/roles`, props.authentication)
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
        if (user.isLoading || roles.isLoading || !hasRoleUserAdministration(props.authentication)) {
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
        props.setSidebar()
        props.setTopbar({
            title: "Benutzer verwalten",
            showBackButton: true,
            backButtonPath: "/settings",
        })

        window.scrollTo(0, 0)
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        successTimeout.clearTimeout()

        if (user.isLoading) {
            return
        }

        setPageState(PageState.LOADING)

        const response: boolean = await tryApiRequest("PATCH", `/api/users/${id}`, async apiUrl => {
            return await axios.patch(apiUrl, {
                ...formData,
                active: formData.active === SwitchValue.ON,
            })
        })

        if (response) {
            props.userGroups.load()
            successTimeout.startTimeout()
            setPageState(PageState.SUCCESS)
        } else {
            setPageState(PageState.ERROR)
        }
    }

    return (
        <StandardContentWrapper className="md:w-[450px]">
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
                        <Card>
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
                        </Card>

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
