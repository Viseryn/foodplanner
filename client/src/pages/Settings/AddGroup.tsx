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
import { useApiResourceCollection } from "@/hooks/useApiResourceCollection"
import { useNullishContext } from "@/hooks/useNullishContext"
import { StandardContentWrapper } from "@/layouts/StandardContentWrapper"
import { UserGroup } from "@/types/api/post/UserGroup"
import { User } from "@/types/api/User"
import { PageState } from "@/types/enums/PageState"
import { UserGroupForm } from "@/types/forms/UserGroupForm"
import { GlobalAppData } from "@/types/GlobalAppData"
import { ManagedResourceCollection } from "@/types/ManagedResourceCollection"
import { UserOption } from "@/types/options/UserOption"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { Topbar } from "@/types/topbar/Topbar"
import { ApiRequest } from "@/util/ApiRequest"
import { getEntityOptions } from "@/util/forms/getEntityOptions"
import { getFormOptions } from "@/util/forms/getFormOptions"
import { ReactElement, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

export const AddGroup = (): ReactElement => {
    const sidebar: Sidebar = useNullishContext(SidebarContext)
    const topbar: Topbar = useNullishContext(TopbarContext)
    const { userGroups }: Partial<GlobalAppData> = useNullishContext(GlobalAppDataContext)

    const [state, setState] = useState<PageState>(PageState.WAITING)
    const [formData, setFormData] = useState<UserGroupForm>({
        name: "",
        icon: "",
        users: [],
    })

    const users: ManagedResourceCollection<User> = useApiResourceCollection('/api/users', true)
    const userOptions: UserOption[] = getEntityOptions(users, UserOption)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (users.isLoading) {
            return
        }

        setState(PageState.LOADING)

        const response: boolean = await ApiRequest.post<UserGroup>("/api/user_groups", {
            ...formData,
            "@type": "UserGroup",
            hidden: false,
            readonly: false,
        }).execute()

        if (response) {
            userGroups.load()
            setState(PageState.SUCCESS)
        } else {
            setState(PageState.ERROR)
        }
    }

    useEffect(() => {
        sidebar.useDefault()
        topbar.configuration
              .title("Neue Benutzergruppe")
              .backButton({ isVisible: true, path: "/settings" })
              .mainViewWidth("md:w-[450px]")
              .rebuild()

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper>
            {state === PageState.LOADING &&
                <Spinner />
            }

            {state === PageState.SUCCESS &&
                <Navigate to="/settings" />
            }

            {[PageState.WAITING, PageState.ERROR].includes(state) &&
                <form name="user_group" onSubmit={handleSubmit}>
                    <OuterCard>
                        <p className="text-sm">
                            Hier kannst du eine neue Benutzergruppen hinzufügen. Die Liste von Material Symbols findest
                            du <a target="_blank" rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-400 transition duration-300"
                                  href="https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols">hier</a>.
                        </p>

                        <Spacer height="6" />

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
