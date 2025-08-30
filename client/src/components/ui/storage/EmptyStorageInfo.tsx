import { ReactElement } from "react"

export const EmptyStorageInfo = (): ReactElement => {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                <span className="material-symbols-rounded outlined mr-4">info</span>
                Die Liste ist leer.
            </div>
        </div>
    )
}
