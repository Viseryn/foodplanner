import { ReactElement } from "react"

/**
 * A component that renders a vertical spacer.
 *
 * @component
 * @param props
 * @param props.height Height of the spacer in multiples of 4px = .25rem (equivalent to height 1).
 *
 * @example <Spacer height="10" />
 *
 * @deprecated
 */
export default function Spacer({ height }: {
    height: string | number
}): ReactElement {
    return <div className={`h-${height.toString()}`} />
}
