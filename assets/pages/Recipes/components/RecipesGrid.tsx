import React, { ReactElement, ReactNode } from 'react'

export function RecipesGrid(props: { children: ReactNode }): ReactElement {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {props.children}
        </div>
    )
}
