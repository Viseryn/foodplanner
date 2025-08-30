import { BackButtonConfiguration } from "@/types/topbar/BackButtonConfiguration"
import { TopbarActionButton } from "@/types/topbar/TopbarActionButton"
import { TopbarConfiguration } from "@/types/topbar/TopbarConfiguration"
import { TopbarDropdownMenuItem } from "@/types/topbar/TopbarDropdownMenuItem"

export type Topbar = {
    title: string
    backButton: BackButtonConfiguration
    actionButtons: TopbarActionButton[]
    dropdownMenuItems: TopbarDropdownMenuItem[]
    truncate: boolean
    isLoading: boolean
    style: string
    configuration: TopbarConfiguration
    useDefault: (title: string) => void
}
