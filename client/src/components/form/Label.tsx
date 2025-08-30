import { ReactElement } from "react"

type LabelProps = {
    htmlFor: string
    children: React.ReactNode
}

export const Label = (props: LabelProps): ReactElement => (
    <label htmlFor={props.htmlFor} className="text-sm font-semibold block mb-2">
        {props.children}
    </label>
)
