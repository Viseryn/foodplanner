import React, { ReactElement, ReactNode } from 'react'
import { ViewMode } from '@/pages/Recipes/constants/ViewMode'

export function RecipesGrid(props: { viewMode: ViewMode, children: ReactNode }): ReactElement {
    switch (props.viewMode) {
        case ViewMode.GRID: return (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {props.children}
            </div>
        )
        case ViewMode.LIST: return (
            <div className="grid grid-cols-1 gap-2">
                {props.children}
            </div>
        )
    }
}
