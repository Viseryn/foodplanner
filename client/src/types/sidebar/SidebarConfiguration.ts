import { SidebarActionButtonConfiguration } from "@/types/sidebar/SidebarActionButtonConfiguration"

export interface SidebarConfiguration {
    activeItem: (activeItem?: string) => SidebarConfiguration
    actionButton: (actionButton?: SidebarActionButtonConfiguration) => SidebarConfiguration
    isDrawerVisible: (isDrawerVisible?: boolean) => SidebarConfiguration
    /** Overrides all non-set Sidebar attributes with the default values. */
    rebuild: () => void
    updateNotificationDot: (item: string, value: number) => void
}
