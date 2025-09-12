import { ReactElement } from "react"

export const NotificationDot = ({ value }: { value: number }): ReactElement => (
    <div className="absolute inline-flex items-center justify-center top-0 right-0 transform translate-x-1 -translate-y-1 w-6 h-6 xl:top-5 xl:right-5 bg-red-500 border-2 border-bg dark:border-bg-dark xl:border-0 rounded-full z-40 font-bold text-xs text-white">
        {value}
    </div>
)
