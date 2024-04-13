import Spinner from '@/components/ui/Spinner'
import { StandardContentWrapper } from "@/components/ui/StandardContentWrapper"
import { BasePageComponentProps } from "@/types/BasePageComponentProps"
import { tryApiRequest } from "@/util/tryApiRequest"
import axios from 'axios'
import React, { ReactElement, useEffect } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

export const Logout = ({ authentication, setSidebar, setTopbar }: BasePageComponentProps & {
    authentication: Authentication
}): ReactElement => {
    const navigate: NavigateFunction = useNavigate()

    useEffect(() => {
        if (authentication.isAuthenticated) {
            void tryApiRequest("GET", "/api/logout", async (apiUrl) => {
                const response = await axios.get(apiUrl)
                location.reload()
                return response
            })
        } else {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        setSidebar()
        setTopbar({ title: 'Logout' })
    }, [])

    return (
        <StandardContentWrapper className="md:w-[450px]">
            <Spinner />
        </StandardContentWrapper>
    )
}
