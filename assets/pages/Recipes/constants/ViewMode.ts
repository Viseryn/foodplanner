export enum ViewMode {
    GRID,
    LIST,
}

export function toString(viewMode: ViewMode): string {
    return ViewMode[viewMode]
}

export function parse(viewMode: string): ViewMode {
    return ViewMode[viewMode as keyof typeof ViewMode]
}

export function getSuccessor(viewMode: ViewMode): ViewMode {
    switch (viewMode) {
        case ViewMode.LIST: return ViewMode.GRID
        case ViewMode.GRID: return ViewMode.LIST
    }
}

export function getIcon(viewMode: ViewMode): string {
    switch (viewMode) {
        case ViewMode.LIST: return 'grid_view'
        case ViewMode.GRID: return 'view_agenda'
    }
}