import InputRow from '@/components/form/Input/InputRow'
import SelectRow from '@/components/form/Select/SelectRow'
import Button from '@/components/ui/Buttons/Button'
import Card from '@/components/ui/Card'
import Spacer from '@/components/ui/Spacer'
import Spinner from '@/components/ui/Spinner'
import { StandardContentWrapper } from "@/components/ui/StandardContentWrapper"
import { useEntityState } from '@/hooks/useEntityState'
import { PageState } from "@/types/enums/PageState"
import { UserGroupModel } from '@/types/UserGroupModel'
import { UserModel } from '@/types/UserModel'
import UserOption from '@/types/UserOption'
import getEntityOptions from '@/util/getEntityOptions'
import getOptions from '@/util/getOptions'
import { tryApiRequest } from "@/util/tryApiRequest"
import axios, { AxiosResponse } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

type AddGroupProps = {
    authentication: Authentication
    userGroups: EntityState<Array<UserGroupModel>>
    setSidebar: SetSidebarAction
    setTopbar: SetTopbarAction
}

export const AddGroup = ({ authentication, userGroups, setSidebar, setTopbar }: AddGroupProps): ReactElement => {
    const [state, setState] = useState<PageState>(PageState.WAITING)

    // A list of all users
    const users: EntityState<UserModel[]> = useEntityState('/api/users', authentication)
    const userOptions: UserOption[] = getEntityOptions(users, UserOption)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        if (users.isLoading) {
            return
        }

        const formData: FormData = new FormData(event.currentTarget)
        setState(PageState.LOADING)

        void tryApiRequest("POST", "/api/usergroups", async (apiUrl) => {
            const response: AxiosResponse<UserGroupModel> = await axios.post(apiUrl, formData)

            userGroups.load()
            setState(PageState.SUCCESS)

            return response
        })
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

            {state === PageState.WAITING &&
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
                            id="user_group_name"
                            label="Name der Benutzergruppe"
                            {...{
                                required: true,
                                maxLength: 64,
                                placeholder: 'Name der Benutzergruppe',
                            }}
                        />

                        <Spacer height="6" />

                        <InputRow
                            id="user_group_icon"
                            label="Icon der Benutzergruppe (optional)"
                            {...{
                                required: true,
                                maxLength: 255,
                                placeholder: 'Material-Symbols-Bezeichnung, z.B. face_5',
                            }}
                        />

                        <Spacer height="6" />

                        {users.isLoading
                            ? <Spinner verticalMargin={10} />
                            : <SelectRow
                                id="user_group_users"
                                label="Welche Benutzer sollen zur Gruppe gehören?"
                                options={getOptions(userOptions)}
                                {...{
                                    name: "user_group[users][]",
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
