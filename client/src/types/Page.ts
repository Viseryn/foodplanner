import { ReactElement } from "react"

export type Page = {
    id: string
    path: string
    element: ReactElement
    authenticationNeeded?: boolean
}
