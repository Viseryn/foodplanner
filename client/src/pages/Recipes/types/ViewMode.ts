export type ViewMode = "LIST" | "GRID"

export function getSuccessor(viewMode: ViewMode): ViewMode {
    switch (viewMode) {
        case "LIST": return "GRID"
        case "GRID": return "LIST"
    }
}

export function getIcon(viewMode: ViewMode): string {
    switch (viewMode) {
        case "LIST": return "grid_view"
        case "GRID": return "view_agenda"
    }
}
