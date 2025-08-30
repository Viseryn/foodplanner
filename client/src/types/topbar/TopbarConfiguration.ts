import { BackButtonConfiguration } from "@/types/topbar/BackButtonConfiguration"
import { TopbarActionButton } from "@/types/topbar/TopbarActionButton"
import { TopbarDropdownMenuItem } from "@/types/topbar/TopbarDropdownMenuItem"

export interface TopbarConfiguration {
    title: (title?: string) => TopbarConfiguration
    backButton: (backButton?: BackButtonConfiguration) => TopbarConfiguration
    actionButtons: (actionButtons?: TopbarActionButton[]) => TopbarConfiguration
    dropdownMenuItems: (dropdownMenuItems?: TopbarDropdownMenuItem[]) => TopbarConfiguration
    truncate: (truncate?: boolean) => TopbarConfiguration
    isLoading: (isLoading?: boolean) => TopbarConfiguration
    style: (style?: string) => TopbarConfiguration
    mainViewWidth: (mainViewWidth?: string) => TopbarConfiguration
    /** Overrides all non-set Sidebar attributes with the default values. */
    rebuild: () => void
}
