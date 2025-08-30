import { ReactElement } from "react"

/**
 * A component that renders a File Picker button which prompts a file select.
 * Can be disabled by setting enabled to be false.
 *
 * @component
 * @param props
 * @param props.id The form id of this input field.
 * @param props.label The label of the button.
 * @param props.onChange Optional: A function that is called when a file was selected.
 * @param props.enabled Optional: Whether the button is enabled or disabled. Default is true.
 *
 * @todo Make this a Button component
 */
export default function FileSelectButton({ id, label, onChange, enabled = true }: {
    id: string
    label: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    enabled?: boolean
}): ReactElement {
    return <>
        <label
            htmlFor={id}
            className={enabled
                ? "cursor-pointer overflow-hidden rounded-full h-10 px-4 font-semibold text-md transition duration-300 flex items-center active:scale-95 text-primary-100 dark:text-primary-dark-100 bg-secondary-200 dark:bg-secondary-dark-200 hover:bg-secondary-300 dark:hover:bg-secondary-dark-300"
                : "rounded-full h-10 px-4 font-semibold transition duration-300 flex items-center text-notification-600 dark:text-notification-800 bg-notification-500 dark:bg-notification-600"
            }
        >
            <span className="material-symbols-rounded">photo_size_select_small</span>
            <span className="max-h-6 overflow-hidden mr-2 ml-3">
                {enabled ? label : "Datei auswählen"}
            </span>
        </label>
        <input
            disabled={!enabled}
            type="file"
            id={id}
            name={id}
            className="file-input hidden"
            onChange={onChange}
        />
    </>
}
