import { ViewMode } from "@/pages/Recipes/types/ViewMode"
import { ReactElement, ReactNode } from "react"

export function RecipesGrid(props: { viewMode?: ViewMode, children: ReactNode }): ReactElement {
    switch (props.viewMode) {
        case "LIST":
            return (
                <div className="grid grid-cols-1 gap-2">
                    {props.children}
                </div>
            )
        case "GRID":
        default:
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {props.children}
                </div>
            )
    }
}
