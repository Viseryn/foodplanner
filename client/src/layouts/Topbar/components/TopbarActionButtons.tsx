import IconButton from "@/components/ui/Buttons/IconButton"
import { TopbarContext } from "@/context/TopbarContext"
import { useNullishContext } from "@/hooks/useNullishContext"
import { Topbar } from "@/types/topbar/Topbar"
import { TopbarDropdownMenuItem } from "@/types/topbar/TopbarDropdownMenuItem"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ReactElement } from "react"

export const TopbarActionButtons = (style: string = ""): ReactElement => {
    const topbar: Topbar = useNullishContext(TopbarContext)

    return (
        <div className={`flex space-x-2 ${style}`}>
            {topbar.actionButtons.map((button, index) =>
                <IconButton
                    key={index}
                    outlined={!button.filled}
                    onClick={button.onClick}
                >
                    {button.icon}
                </IconButton>,
            )}

            {topbar.dropdownMenuItems.length > 0 && (
                <Menu>
                    <MenuButton className="focus:outline-none">
                        <IconButton>more_vert</IconButton>
                    </MenuButton>

                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="z-50 bg-white dark:bg-secondary-dark-100 origin-top-right mt-2 shadow-2xl rounded-2xl p-2 space-y-2 transition duration-300 ease-out focus:outline-none"
                    >
                        {topbar.dropdownMenuItems.map((dropdownMenuItem: TopbarDropdownMenuItem, index: number) =>
                            <MenuItem key={index}>
                                <div onClick={dropdownMenuItem.onClick} className="flex items-center gap-4 h-10 p-2 rounded-xl hover:bg-secondary-200/40 dark:hover:bg-secondary-dark-200/40 cursor-pointer transition duration-300">
                                    <span className={`material-symbols-rounded text-balance ${!dropdownMenuItem.filled ? "outlined" : ""}`}>
                                        {dropdownMenuItem.icon}
                                    </span>
                                    {dropdownMenuItem.label}
                                </div>
                            </MenuItem>,
                        )}
                    </MenuItems>
                </Menu>
            )}
        </div>
    )
}
