export type SidebarActionButtonConfiguration = {
    /** Sets the visibility of the action button. */
    isVisible: boolean
    /** Sets the icon of the action button. */
    icon: string
    /** Sets the label text of the action button. */
    label: string
    /** If a path is set, a click on the action button will redirect to the path. */
    path?: string
    /** A custom onClick handler callback. */
    onClick?: () => void
}
