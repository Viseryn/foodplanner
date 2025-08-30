import { NotificationDot } from "@/types/NotificationDot"
import { Sidebar } from "@/types/sidebar/Sidebar"
import { SidebarActionButtonConfiguration } from "@/types/sidebar/SidebarActionButtonConfiguration"
import { SidebarConfiguration } from "@/types/sidebar/SidebarConfiguration"
import { useState } from "react"

const DEFAULT_SIDEBAR_ACTION_BUTTON_CONFIGURATION: SidebarActionButtonConfiguration = {
    path: "",
    isVisible: false,
    onClick: () => null,
    icon: "",
    label: "",
}

export const useSidebar = (): Sidebar => {
    const [activeItem, setActiveItem] = useState<string>("")
    const [actionButton, setActionButton] = useState<SidebarActionButtonConfiguration>(DEFAULT_SIDEBAR_ACTION_BUTTON_CONFIGURATION)
    const [isDrawerVisible, setDrawerVisible] = useState<boolean>(false)
    const [notificationDots, setNotificationDots] = useState<NotificationDot[]>([])

    class SidebarConfigurationImplementation implements SidebarConfiguration {
        _activeItem: string = ""
        _actionButton: SidebarActionButtonConfiguration = DEFAULT_SIDEBAR_ACTION_BUTTON_CONFIGURATION
        _isDrawerVisible: boolean = false

        activeItem(activeItem: string = ""): SidebarConfigurationImplementation {
            this._activeItem = activeItem
            setActiveItem(this._activeItem)
            return this
        }

        actionButton(actionButton: SidebarActionButtonConfiguration = DEFAULT_SIDEBAR_ACTION_BUTTON_CONFIGURATION): SidebarConfigurationImplementation {
            this._actionButton = actionButton
            setActionButton(this._actionButton)
            return this
        }

        isDrawerVisible(isDrawerVisible: boolean = false): SidebarConfigurationImplementation {
            this._isDrawerVisible = isDrawerVisible
            setDrawerVisible(this._isDrawerVisible)
            return this
        }

        rebuild(): void {
            this.activeItem(this._activeItem)
                .actionButton(this._actionButton)
                .isDrawerVisible(this._isDrawerVisible)
        }

        updateNotificationDot(item: string, value: number) {
            setNotificationDots(oldNotificationDots => [
                ...oldNotificationDots.filter(notificationDot => notificationDot.item !== item),
                { item, value },
            ])
        }
    }

    return {
        activeItem,
        actionButton,
        isDrawerVisible,
        notificationDots,
        configuration: new SidebarConfigurationImplementation(),
        useDefault: (): void => new SidebarConfigurationImplementation().rebuild(),
    }
}
