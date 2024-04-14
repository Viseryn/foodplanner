import InputRow from '@/components/form/Input/InputRow'
import SelectRow from '@/components/form/Select/SelectRow'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import { StandardContentWrapper } from "@/components/ui/StandardContentWrapper"
import { useEntityState } from '@/hooks/useEntityState'
import { handleSelectedUsersChange } from "@/pages/Settings/util/handleSelectedUsersChange"
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import { PageState } from "@/types/enums/PageState"
import { UserGroupForm } from "@/types/forms/UserGroupForm"
import { UserGroupModel } from '@/types/UserGroupModel'
import { UserModel } from '@/types/UserModel'
import UserOption from '@/types/UserOption'
import getEntityOptions from '@/util/getEntityOptions'
import getOptions from '@/util/getOptions'
import { handleInputChange } from "@/util/handleInputChange"
import { tryApiRequest } from "@/util/tryApiRequest"
import axios from "axios"
import React, { ReactElement, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

type AddGroupProps = BasePageComponentProps & {
    authentication: Authentication
    userGroups: EntityState<Array<UserGroupModel>>
}

export const AddGroup = ({ authentication, userGroups, setSidebar, setTopbar }: AddGroupProps): ReactElement => {
    const [state, setState] = useState<PageState>(PageState.WAITING)
    const [formData, setFormData] = useState<UserGroupForm>({
        name: "",
        icon: "",
        users: [],
    })

    const users: EntityState<UserModel[]> = useEntityState('/api/users', authentication)
    const userOptions: UserOption[] = getEntityOptions(users, UserOption)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (users.isLoading) {
            return
        }

        setState(PageState.LOADING)

        const userGroupDto: UserGroupModel = {
            ...formData,
            id: -1,
            hidden: false,
            readonly: false,
            position: 0,
            users: formData.users.map(value =>
                users.data.filter((user: UserModel) => user.id?.toString() === value)?.[0]
            )
        }

        const response: boolean = await tryApiRequest("POST", "/api/usergroups", async apiUrl => {
            return await axios.post(apiUrl, userGroupDto)
        })

        if (response) {
            userGroups.load()
            setState(PageState.SUCCESS)
        } else {
            setState(PageState.ERROR)
        }
    }

    useEffect(() => {
        setSidebar()
        setTopbar({
            title: 'Neue Benutzergruppe',
            showBackButton: true,
            backButtonPath: '/settings',
        })

        window.scrollTo(0, 0)
    }, [])

    return (
        <StandardContentWrapper className="md:w-[450px]">
            {state === PageState.LOADING &&
                <Spinner />
            }

            {state === PageState.SUCCESS &&
                <Navigate to="/settings" />
            }

            {[PageState.WAITING, PageState.ERROR].includes(state) &&
                <form name="user_group" onSubmit={handleSubmit}>
                    <Card>
                        <p className="text-sm">
                            Hier kannst du eine neue Benutzergruppen hinzufügen. Die Liste von Material Symbols findest
                            du <a target="_blank" rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-400 transition duration-300"
                                  href="https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols">hier</a>.
                        </p>

                        <Spacer height="6" />

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
                                    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => handleSelectedUsersChange<UserGroupForm>(event, setFormData),
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
