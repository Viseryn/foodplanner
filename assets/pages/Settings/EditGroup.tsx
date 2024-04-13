import InputRow from "@/components/form/Input/InputRow"
import SelectRow from "@/components/form/Select/SelectRow"
import Button from "@/components/ui/Buttons/Button"
import Card from "@/components/ui/Card"
import Spacer from "@/components/ui/Spacer"
import Spinner from "@/components/ui/Spinner"
import { StandardContentWrapper } from "@/components/ui/StandardContentWrapper"
import { useEntityState } from "@/hooks/useEntityState"
import { useFindEntityById } from "@/hooks/useFindEntityById"
import { handleSelectedUsersChange } from "@/pages/Settings/util/handleSelectedUsersChange"
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import { PageState } from "@/types/enums/PageState"
import { UserGroupForm } from "@/types/forms/UserGroupForm"
import { Optional } from "@/types/Optional"
import { UserGroupModel } from "@/types/UserGroupModel"
import { UserModel } from "@/types/UserModel"
import UserOption from "@/types/UserOption"
import getEntityOptions from "@/util/getEntityOptions"
import getOptions from "@/util/getOptions"
import { handleInputChange } from "@/util/handleInputChange"
import { tryApiRequest } from "@/util/tryApiRequest"
import axios from "axios"
import React, { ReactElement, useEffect, useState } from "react"
import { Navigate, useParams } from "react-router-dom"

type EditGroupProps = BasePageComponentProps & {
    authentication: Authentication
    userGroups: EntityState<UserGroupModel[]>
}

type EditGroupRouteParams = {
    id?: string
}

export const EditGroup = (props: EditGroupProps): ReactElement => {
    const { id }: EditGroupRouteParams = useParams()
    const users: EntityState<UserModel[]> = useEntityState('/api/users', props.authentication)
    const userOptions: UserOption[] = getEntityOptions(users, UserOption)
    const selectedUserGroup: Optional<UserGroupModel> = useFindEntityById(id, props.userGroups)

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

        if (!!selectedUserGroup) {
            setFormData({
                name: selectedUserGroup.name,
                icon: selectedUserGroup.icon,
                users: selectedUserGroup.users.map(user => user.id!.toString())
            })
            setPageState(PageState.WAITING)
        }
    }, [users.isLoading, selectedUserGroup])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (users.isLoading) {
            return
        }

        setPageState(PageState.LOADING)

        const requestData: Partial<UserGroupModel> = {
            ...formData,
            users: formData.users.map(value => users.data.find(user => user.id!.toString() === value)!)
        }

        const response: boolean = await tryApiRequest("PATCH", `/api/usergroups/${id}`, async apiUrl => {
            return await axios.patch(apiUrl, requestData)
        })

        if (response) {
            props.userGroups.load()
            setPageState(PageState.SUCCESS)
        } else {
            setPageState(PageState.ERROR)
        }
    }

    useEffect(() => {
        props.setSidebar()
        props.setTopbar({
            title: 'Benutzergruppe bearbeiten',
            showBackButton: true,
            backButtonPath: '/settings',
        })

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper className="md:w-[450px]">
            {pageState === PageState.LOADING &&
                <Spinner />
            }

            {pageState === PageState.SUCCESS &&
                <Navigate to="/settings" />
            }

            {[PageState.WAITING, PageState.ERROR].includes(pageState) &&
                <form name="user_group" onSubmit={handleSubmit}>
                    <Card>
                        <InputRow
                            id="name"
                            label="Name der Benutzergruppe"
                            {...{
                                value: formData.name,
                                required: true,
                                maxLength: 64,
                                name: "name",
                                onChange: (event: React.ChangeEvent<HTMLInputElement>) => handleInputChange<UserGroupForm>(event, setFormData),
                                placeholder: 'Name der Benutzergruppe',
                            }}
                        />

                        <Spacer height="6" />

                        <InputRow
                            id="icon"
                            label="Icon der Benutzergruppe"
                            {...{
                                value: formData.icon,
                                required: true,
                                maxLength: 255,
                                name: "icon",
                                onChange: (event: React.ChangeEvent<HTMLInputElement>) => handleInputChange<UserGroupForm>(event, setFormData),
                                placeholder: 'Material-Symbols-Bezeichnung, z.B. face_5',
                            }}
                        />

                        <Spacer height="6" />

                        {users.isLoading
                            ? <Spinner verticalMargin={10} />
                            : <SelectRow
                                id="users"
                                label="Welche Benutzer sollen zur Gruppe gehören?"
                                options={getOptions(userOptions)}
                                {...{
                                    value: formData.users,
                                    name: "users",
                                    onChange: (event: React.ChangeEvent<HTMLInputElement>) => handleSelectedUsersChange<UserGroupForm>(event, setFormData),
                                    multiple: true,
                                    required: true,
                                    size: getOptions(userOptions).length,
                                    className: 'dark:placeholder-secondary-dark-900 dark:bg-secondary-dark-200 border border-gray-300 dark:border-none rounded-md px-6 w-full transition duration-300 focus:border-primary-100 overflow-hidden',
                                }}
                            />
                        }
                    </Card>

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
