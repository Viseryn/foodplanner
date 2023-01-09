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
    required = false,
    ...radioProps
}) {
    return (
        <div className="flex flex-wrap justify-between gap-2" {...radioProps}>
            {options.map(option => 
                <div className="grow" key={option.value}>
                    <input 
                        id={option.id}
                        type="radio" 
                        name={nameFromId(id)} 
                        defaultValue={option.value}
                        className="peer hidden" 
                        defaultChecked={option.checked}
                        required={required ? 'required' : ''}
                    />
                    <label 
                        htmlFor={option.id}
                        className="cursor-pointer overflow-ellipsis rounded-xl h-9 px-2 font-semibold text-sm transition duration-300 flex items-center active:scale-95 text-primary-100 dark:text-primary-dark-100 bg-secondary-100 dark:bg-secondary-dark-100 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 peer-checked:bg-secondary-200  dark:peer-checked:bg-secondary-dark-200 -dark:peer-checked:text-blue-800 border border-secondary-200 dark:border-secondary-dark-200"
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
    required = false,
    labelProps = {}, 
    radioProps = {}, 
    ...rowProps
}) {
    return (
        <div className={rowProps.className !== undefined ? rowProps.className : inputRowStyle}>
            {rowProps.label !== undefined && <InputLabel htmlFor={id} label={rowProps.label} {...labelProps} />}
            <RadioWidget id={id} options={options} required={required} {...radioProps} />
        </div>
    );
}

/**
 * Export components
 */
export { RadioWidget, RadioRow };
