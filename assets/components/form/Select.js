/**************************************
 * ./assets/components/form/Select.js *
 **************************************/

import React from "react";

import { nameFromId, inputRowStyle, inputWidgetStyle } from "./Forms";
import { InputLabel } from "./Input";

/**
 * SelectWidget
 * 
 * A component that renders a select input field.
 * 
 * @component
 * @property {string} id The id of the select input field.
 * @property {arr} options An array of objects that represent the select options.
 * @property {string} disabledOption Text of the disabled option of the select field.
 * @property {*} selectProps An optional object of props for the <select> element.
 * 
 * @example
 * <SelectWidget
 *     id="meal_day"
 *     options={days}
 *     defaultValue={id}
 * />
 * 
 * @deprecated Use Select/SelectWidget instead.
 */
function SelectWidget({
    id, 
    options = [], 
    disabledOption = null, 
    ...selectProps
}) {
    return (
        <select
            id={id}
            name={nameFromId(id)}
            className={inputWidgetStyle}
            {...selectProps}
        >
            {disabledOption !== null &&
                <option disabled="disabled">{disabledOption}</option>
            }
            {options.map((option, i) => 
                <option key={i} value={option.id}>{option.title}</option>
            )}
        </select>
    );
}

/**
 * SelectRow
 * 
 * A component that renders a label and select input field in a div-container.
 * 
 * @component
 * @property {string} id The id of the select input field.
 * @property {arr} options An array of objects that represent the select options.
 * @property {string} disabledOption Text of the disabled option of the select field.
 * @property {*} labelProps An optional object of props for the <label> element.
 * @property {*} selectProps An optional object of props for the <select> element.
 * @property {*} rowProps An optional object of props for the <div> container.
 * 
 * @example
 * <SelectRow
 *     id="meal_day"
 *     label="Für welchen Tag?"
 *     options={days}
 *     defaultValue={id}
 * />
 * 
 * @deprecated Use Select/SelectRow instead.
 */
function SelectRow({
    id, 
    options = [],
    disabledOption = null,
    labelProps = {}, 
    selectProps = {}, 
    ...rowProps
}) {
    return (
        <div className={rowProps.className !== undefined ? rowProps.className : inputRowStyle}>
            {rowProps.label !== undefined && <InputLabel htmlFor={id} label={rowProps.label} {...labelProps} />}
            <SelectWidget id={id} options={options} disabledOption={disabledOption} {...selectProps} />
        </div>
    );
}

/**
 * Export components
 */
 export { SelectWidget, SelectRow };
