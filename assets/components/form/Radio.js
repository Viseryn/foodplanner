/*************************************
 * ./assets/components/form/Radio.js *
 *************************************/

import React from "react";

import { nameFromId, inputRowStyle } from "./Forms";
import { InputLabel } from "./Input";

/**
 * RadioWidget
 * 
 * A component that renders a radio input field.
 * 
 * @component
 * @property {string} id The id of the radio input field.
 * @property {arr} options An array of objects that represent the radio buttons. See example.
 * @property {*} radioProps An optional object of props for the <div> container.
 * 
 * @example
 * <RadioWidget
 *     id="meal_mealCategory"
 *     options={[
 *         {
 *             id: 'mealCategory_breakfast',
 *             value: 1,
 *             icon: 'bakery_dining',
 *             label: 'Morgens',
 *         },
 *         ...options
 *     ]}
 * />
 */
function RadioWidget({
    id, 
    options = [], 
    ...radioProps
}) {
    return (
        <div className="flex flex-wrap justify-between gap-2" {...radioProps}>
            {options.map(option => 
                <div className="grow" key={option.id}>
                    <input 
                        id={option.id}
                        type="radio" 
                        name={nameFromId(id)} 
                        defaultValue={option.value}
                        className="peer hidden" 
                        defaultChecked={option.checked}
                    />
                    <label 
                        htmlFor={option.id}
                        className="cursor-pointer overflow-ellipsis rounded-full h-10 px-3 font-semibold text-sm transition duration-300 flex items-center active:scale-95 text-blue-600 dark:text-blue-300 bg-gray-100 dark:bg-[#1D252C] hover:bg-blue-100 dark:hover:bg-[#1D252C]/[.5] active:bg-blue-300 active:text-blue-800 peer-checked:bg-blue-200 dark:peer-checked:bg-blue-400 dark:peer-checked:text-blue-800"
                    >
                        <span className="material-symbols-rounded">{option.icon}</span>
                        <span className="label-content mr-1 ml-3">{option.label}</span>
                    </label>
                </div>
            )}
        </div>
    );
}

/**
 * RadioRow
 * 
 * A component that renders a label and radio input field in a div-container.
 * 
 * @component
 * @property {string} id The id of the radio input field.
 * @property {arr} options An array of objects that represent the radio buttons. See example.
 * @property {*} labelProps An optional object of props for the <label> element.
 * @property {*} radioProps An optional object of props for the <RadioWidget> component.
 * @property {*} rowProps An optional object of props for the <div> container.
 * 
 * @example
 * <RadioRow
 *     id="meal_mealCategory"
 *     label="Wann ist die Mahlzeit?"
 *     options={[
 *         {
 *             id: 'mealCategory_breakfast',
 *             value: 1,
 *             icon: 'bakery_dining',
 *             label: 'Morgens',
 *         },
 *         ...options
 *     ]}
 * />
 */
function RadioRow({
    id, 
    options = [], 
    labelProps = {}, 
    radioProps = {}, 
    ...rowProps
}) {
    return (
        <div className={rowProps.className !== undefined ? rowProps.className : inputRowStyle}>
            {rowProps.label !== undefined && <InputLabel htmlFor={id} label={rowProps.label} {...labelProps} />}
            <RadioWidget id={id} options={options} {...radioProps} />
        </div>
    );
}

/**
 * Export components
 */
export { RadioWidget, RadioRow };