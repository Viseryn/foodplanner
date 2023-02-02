type SidebarActionButtonConfiguration = {
    path?: string
    visible?: boolean
    onClick?: () => void
    icon?: string
    label?: string
}

type TopbarConfiguration = {
    title?: string
    showBackButton?: boolean
    backButtonPath?: string
    onBackButtonClick?: () => void
    actionButtons?: Array<{ icon: string; onClick?: () => void; }>
    truncate?: boolean
    isLoading?: boolean
    style?: string
}

type FetchableEntity<Type = any> = {
    data: Type | undefined
    setData: React.Dispatch<React.SetStateAction<Type | undefined>>
    isLoading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

type User = {
    id?: number
    username?: string
    roles?: Array<string>
}