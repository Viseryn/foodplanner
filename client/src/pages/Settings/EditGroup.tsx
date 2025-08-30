import { InputWidget } from "@/components/form/InputWidget"
import { LabelledFormWidget } from "@/components/form/LabelledFormWidget"
import { SelectWidget } from "@/components/form/SelectWidget"
import Button from "@/components/ui/Buttons/Button"
import { OuterCard } from "@/components/ui/Cards/OuterCard"
import Spacer from "@/components/ui/Spacer"
import { Spinner } from "@/components/ui/Spinner"
import { GlobalAppDataContext } from "@/context/GlobalAppDataContext"
import { SidebarContext } from "@/context/SidebarContext"
import { TopbarContext } from "@/context/TopbarContext"
import { findEntityByIri } from "@/hooks/findEntityByIri"
import { useApiResourceCollection } from "@/hooks/useApiResourceCollection"
import { useNullishContext } from "@/hooks/useNullishContext"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { UserGroup as UserGroupWithIris } from "@/types/api/post/UserGroup"
import { User } from "@/types/api/User"
import { UserGroup } from "@/types/api/UserGroup"
import { PageState } from "@/types/enums/PageState"
import { UserGroupForm } from "@/types/forms/UserGroupForm"
import { GlobalAppData } from "@/types/GlobalAppData"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { Maybe } from "@/types/Maybe"
import { UserOption } from "@/types/options/UserOption"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import { getEntityOptions } from "@/util/forms/getEntityOptions"
import { getFormOptions } from "@/util/forms/getFormOptions"
import { toIri } from "@/util/toIri"
import { ReactElement, useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"

type EditGroupRouteParams = {
    id?: string
}

export const EditGroup = (): ReactElement => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const { userGroups }: Partial<GlobalAppData> = useNullishContext(GlobalAppDataContext)
    const { id }: EditGroupRouteParams = useParams()
    const users: ManagedResourceCollection<User> = useApiResourceCollection("/api/users", true)
    const userOptions: UserOption[] = getEntityOptions(users, UserOption)
    const selectedUserGroup: Maybe<UserGroup> = findEntityByIri(`/api/user_groups/${id}`, userGroups)

    const [formData, setFormData] = useState<UserGroupForm>({
        name: "",
        icon: "",
        users: [],
    })
    const [pageState, setPageState] = useState<PageState>(PageState.LOADING)

    useEffect(() => {
        if (users.isLoading) {
            return
        }

        if (selectedUserGroup) {
            setFormData({
                name: selectedUserGroup.name,
                icon: selectedUserGroup.icon,
                users: selectedUserGroup.users.map(toIri),
            })
            setPageState(PageState.WAITING)
        }
    }, [users.isLoading, selectedUserGroup])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (users.isLoading || !selectedUserGroup) {
            return
        }

        setPageState(PageState.LOADING)

        const response: boolean = await ApiRequest
            .patch<UserGroupWithIris>(selectedUserGroup["@id"], formData)
            .execute()

        if (response) {
            userGroups.load()
            setPageState(PageState.SUCCESS)
        } else {
            setPageState(PageState.ERROR)
        }
    }

    useEffect(() => {
        sidebar.useDefault()

        topbar.configuration
              .title("Benutzergruppe bearbeiten")
              .backButton({ isVisible: true, path: "/settings" })
              .mainViewWidth("md:w-[450px]")
              .rebuild()

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper>
            {pageState === PageState.LOADING &&
                <Spinner />
            }

            {pageState === PageState.SUCCESS &&
                <Navigate to="/settings" />
            }

            {[PageState.WAITING, PageState.ERROR].includes(pageState) &&
                <form name="user_group" onSubmit={handleSubmit}>
                    <OuterCard>
                        {!selectedUserGroup?.readonly &&
                            <>
                                <LabelledFormWidget
                                    id={"name"}
                                    label={"Name der Benutzergruppe"}
                                    widget={
                                        <InputWidget
                                            field={"name"}
                                            formData={formData}
                                            setFormData={setFormData}
                                            required={true}
                                            maxLength={64}
                                            placeholder={"Name der Benutzergruppe"}
                                        />
                                    }
                                />

                                <Spacer height="6" />
                            </>
                        }

                        <LabelledFormWidget
                            id={"icon"}
                            label={"Icon der Benutzergruppe"}
                            widget={
                                <InputWidget
                                    field={"icon"}
                                    formData={formData}
                                    setFormData={setFormData}
                                    required={true}
                                    maxLength={255}
                                    placeholder={"Material-Symbols-Bezeichnung, z.B. face_5"}
                                />
                            }
                        />

                        {!selectedUserGroup?.readonly &&
                            <>
                                <Spacer height="6" />

                                {users.isLoading
                                    ? <Spinner verticalMargin={10} />
                                    : <LabelledFormWidget
                                        id={"users"}
                                        label={"Welche Benutzer sollen zur Gruppe gehören?"}
                                        widget={
                                            <SelectWidget
                                                field={"users"}
                                                formData={formData}
                                                setFormData={setFormData}
                                                multiple={true}
                                                required={true}
                                                options={getFormOptions(userOptions)}
                                                styleOverride={`dark:placeholder-secondary-dark-900 dark:bg-secondary-dark-200 border border-gray-300 dark:border-none rounded-md px-6 w-full transition duration-300 focus:border-primary-100 overflow-hidden`}
                                            />
                                        }
                                    />
                                }
                            </>
                        }
                    </OuterCard>

                    <div className="flex justify-end md:mt-4 pb-[5.5rem] md:pb-0">
                        {!users.isLoading &&
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
            }
        </StandardContentWrapper>
    )
}
