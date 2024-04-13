type SetSidebarAction = (
    sidebarActiveItem?: string,
    sidebarActionButton?: SidebarActionButtonConfiguration
) => void

type SetTopbarAction = React.Dispatch<TopbarConfiguration>

type SidebarActionButtonConfiguration = {
    path?: string           /** A path that the SAB leads to.            */
    visible?: boolean       /** Whether the SAB shall be visible or not. */
    onClick?: () => void    /** An onClick handler callback.             */
    icon?: string           /** The icon of the SAB.                     */
    label?: string          /** The label text of the SAB.               */
}

type TopbarActionButton = {
    icon: string
    onClick?: () => void
}

type TopbarConfiguration = {
    title?: string                            /** The title of the topbar.                                           */
    showBackButton?: boolean                  /** Whether the back button shall be visible or not.                   */
    backButtonPath?: string                   /** The path that the back button leads to.                            */
    onBackButtonClick?: () => void            /** An onClick handler callback for the back button.                   */
    actionButtons?: Array<TopbarActionButton> /** An array of action buttons for the top-right corner of the topbar. */
    truncate?: boolean                        /** Whether a too long title shall be truncated or not on scroll.                                              */
    isLoading?: boolean                       /** Whether the topbar should display a skeleton while this property is true.                                  */
    style?: string                            /** Additional styling classes for the topbar on larger screns (e.g. a max-width to match the main container). */
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

type SetLoadingAction = (value?: React.SetStateAction<boolean>) => void

type EntityState<T = unknown, TLoading = boolean> = {
    setData: SetState<T | undefined>
    load: SetLoadingAction
} & (TLoading extends false ? {
    data: T
    isLoading: TLoading
} : {
    data?: T
    isLoading: TLoading
})

type Authentication = {
    isAuthenticated: boolean
    isLoading: boolean
}