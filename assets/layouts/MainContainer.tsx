import React, { ReactElement } from "react"

type MainContainerProps = {
    children: React.ReactNode
}

export const MainContainer = ({ children }: MainContainerProps): ReactElement => (
    <div className="flex flex-col w-full">
        {children}
    </div>
)