import { RadioOption } from "@/types/options/RadioOption"

/**
 * For a list of `RadioOption`s and a `defaultChecked` value, updates the `option.checked` value to `true` if
 * `option.value` matches the `defaultCheckedValue`.
 *
 * @param options A set of `RadioOption`s.
 * @param defaultCheckedValue The value that is the `defaultChecked` value. If undefined, the method returns the original argument.
 */
export function setChecked(options: Array<RadioOption>, defaultCheckedValue?: number | string): RadioOption[] {
    if (!defaultCheckedValue) {
        return options
    }

    const optionsCopy = [...options]
    optionsCopy.forEach(option => {
        if (option.value === defaultCheckedValue.toString()) {
            option.checked = true
        }
    })

    return optionsCopy
}
