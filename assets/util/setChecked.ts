/*******************************
 * ./assets/util/setChecked.ts *
 *******************************/

import RadioOption from '@/types/RadioOption'

/**
 * For a list of RadioOptions and a defaultChecked value, updated the option.checked value to true if option.value matches the defaultCheckedValue.
 *
 * @param options A set of RadioOptions.
 * @param defaultCheckedValue The value that is the defaultChecked value. If undefined, the method returns the original argument.
 */
function setChecked(options: Array<RadioOption>, defaultCheckedValue?: number): Array<RadioOption> {
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

export default setChecked
