import { NotificationDot } from "@/types/NotificationDot"
import { SidebarActionButtonConfiguration } from "@/types/sidebar/SidebarActionButtonConfiguration"
import { SidebarConfiguration } from "@/types/sidebar/SidebarConfiguration"

export type Sidebar = {
    activeItem: string
    actionButton: SidebarActionButtonConfiguration
    isDrawerVisible: boolean
    notificationDots: NotificationDot[]
    configuration: SidebarConfiguration
    useDefault: () => void
}
