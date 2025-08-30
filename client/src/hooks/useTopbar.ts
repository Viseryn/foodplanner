import { MainViewWidthContext } from "@/context/MainViewWidthContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { BackButtonConfiguration } from "@/types/topbar/BackButtonConfiguration"
import { Topbar } from "@/types/topbar/Topbar"
import { TopbarActionButton } from "@/types/topbar/TopbarActionButton"
import { TopbarConfiguration } from "@/types/topbar/TopbarConfiguration"
import { TopbarDropdownMenuItem } from "@/types/topbar/TopbarDropdownMenuItem"
import { useState } from "react"

const DEFAULT_TOPBAR_BACK_BUTTON_CONFIGURATION: BackButtonConfiguration = { isVisible: false, path: "" }

export const useTopbar = (): Topbar => {
    const [title, setTitle] = useState<string>("")
    const [backButton, setBackButton] = useState<BackButtonConfiguration>(DEFAULT_TOPBAR_BACK_BUTTON_CONFIGURATION)
    const [actionButtons, setActionButtons] = useState<TopbarActionButton[]>([])
    const [dropdownMenuItems, setDropdownMenuItems] = useState<TopbarDropdownMenuItem[]>([])
    const [truncate, setTruncate] = useState<boolean>(false)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [style, setStyle] = useState<string>("")

    const mainViewWidthContext = useNullishContext(MainViewWidthContext)

    class TopbarConfigurationImplementation implements TopbarConfiguration {
        _title: string = ""
        _backButton: BackButtonConfiguration = DEFAULT_TOPBAR_BACK_BUTTON_CONFIGURATION
        _actionButtons: TopbarActionButton[] = []
        _dropdownMenuItems: TopbarDropdownMenuItem[] = []
        _truncate: boolean = false
        _isLoading: boolean = false
        _style: string = ""
        _mainViewWidth: string = ""

        title(title: string = ""): TopbarConfigurationImplementation {
            this._title = title
            setTitle(this._title)
            return this
        }

        backButton(backButton: BackButtonConfiguration = DEFAULT_TOPBAR_BACK_BUTTON_CONFIGURATION): TopbarConfigurationImplementation {
            this._backButton = backButton
            setBackButton(this._backButton)
            return this
        }

        actionButtons(actionButtons: TopbarActionButton[] = []): TopbarConfigurationImplementation {
            this._actionButtons = actionButtons
            setActionButtons(this._actionButtons)
            return this
        }

        dropdownMenuItems(dropdownMenuItems: TopbarDropdownMenuItem[] = []): TopbarConfigurationImplementation {
            this._dropdownMenuItems = dropdownMenuItems
            setDropdownMenuItems(this._dropdownMenuItems)
            return this
        }

        truncate(truncate: boolean = false): TopbarConfigurationImplementation {
            this._truncate = truncate
            setTruncate(this._truncate)
            return this
        }

        isLoading(isLoading: boolean = false): TopbarConfigurationImplementation {
            this._isLoading = isLoading
            setLoading(this._isLoading)
            return this
        }

        style(style: string = ""): TopbarConfigurationImplementation {
            this._style = style
            setStyle(this._style)
            return this
        }

        mainViewWidth(mainViewWidth: string = ""): TopbarConfigurationImplementation {
            this._mainViewWidth = mainViewWidth
            mainViewWidthContext.setMainViewWidth(this._mainViewWidth)
            return this
        }

        rebuild(): void {
            this.title(this._title)
                .backButton(this._backButton)
                .actionButtons(this._actionButtons)
                .dropdownMenuItems(this._dropdownMenuItems)
                .truncate(this._truncate)
                .isLoading(this._isLoading)
                .style(this._style)
                .mainViewWidth(this._mainViewWidth)
        }
    }

    return {
        title,
        backButton,
        actionButtons,
        dropdownMenuItems,
        truncate,
        isLoading,
        style,
        configuration: new TopbarConfigurationImplementation(),
        useDefault: (title: string): void => new TopbarConfigurationImplementation().title(title).rebuild(),
    }
}
