import { StringBuilder } from "@/util/StringBuilder"
import { ReactElement } from "react"

type TooltipProps = {
    children: ReactElement
    text: string
}

export const Tooltip = (props: TooltipProps): ReactElement => (
    <div className="relative inline-block group">
        {props.children}

        <div className={StringBuilder.cn(
            "absolute z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opcaity duration-300",
            "bg-bg-dark dark:bg-secondary-dark-200 text-white dark:text-primary-dark-100 px-4 py-1 rounded-lg whitespace-nowrap text-sm font-bold",
            "bottom-full mb-1 left-1/2 -translate-x-1/2"
        )}>
            {props.text}
        </div>
    </div>
)
