import { ReactElement } from "react"

type BaseLayoutProps = {
    children: React.ReactNode
}

export const BaseLayout = ({ children }: BaseLayoutProps): ReactElement => (
    <div className="flex flex-col md:flex-row items-start bg-bg dark:bg-bg-dark min-h-screen text-secondary-900 dark:text-secondary-dark-900 min-w-[375px]">
        {children}
    </div>
)