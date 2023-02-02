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
    actionButtons?: Array<Object>
    truncate?: boolean
    isLoading?: boolean
    style?: string
}