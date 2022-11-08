/*************************************
 * ./assets/components/form/Input.js *
 *************************************/

import React from "react";

import { nameFromId, inputLabelStyle, inputRowStyle, inputWidgetStyle } from "./Forms";

/**
 * InputLabel
 * 
 * A component that renders the label of some input field.
 * 
 * @component
 * @property {string} htmlFor The id of the corresponding input field.
 * @property {string} label The label content.
 * @property {*} labelProps An optional object of props for the <label> element.
 * 
 * @example
 * <InputLabel 
 *     htmlFor="recipe_name"
 *     label="Name of recipe"
 *     onClick={handleClickLabel}
 * />
 */
function InputLabel({
    htmlFor, 
    label, 
    ...labelProps
}) {
    return(
        <label htmlFor={htmlFor} className={inputLabelStyle} {...labelProps}>
            {label}
        </label>
    );
}

/**
 * InputWidget
 * 
 * A component that renders an input field.
 * 
 * @component
 * @property {string} id The id of the input field.
 * @property {string} type The type of the input field. Default is 'text'.
 * @property {*} inputProps An optional object of props for the <input> element.
 * 
 * @example
 * <InputWidget
 *     id="_password"
 *     type="password"
 *     className="rounded-full"
 * />
 */
function InputWidget({
    id, 
    type = 'text', 
    ...inputProps
}) {
    return (
        <input 
            type={type}
            id={id}
            name={nameFromId(id)}
            className={inputWidgetStyle}
            {...inputProps}
        />
    );
}

/**
 * InputRow
 * 
 * A component that renders a label and input field in a div-container.
 * 
 * @component
 * @property {string} id The id of the input field.
 * @property {string} type The type of the input field. Default is 'text'.
 * @property {*} labelProps An optional object of props for the <label> element.
 * @property {*} inputProps An optional object of props for the <input> element.
 * @property {*} rowProps An optional object of props for the <div> container.
 * 
 * @example
 * <InputRow
 *     id="recipe_name"
 *     label="Name of recipe"
 *     labelProps={{
 *         className: 'text-lg',
 *     }}
 *     className="mb-10"
 * />
 */
function InputRow({
    id, 
    type = 'text', 
    labelProps = {}, 
    inputProps = {}, 
    ...rowProps
}) {
    return (
        <div className={rowProps.className !== undefined ? rowProps.className : inputRowStyle}>
            {rowProps.label !== undefined && <InputLabel htmlFor={id} label={rowProps.label} {...labelProps} />}
            <InputWidget id={id} type={type} {...inputProps} />
        </div>
    );
}

/**
 * Export components
 */
export { InputRow, InputWidget, InputLabel };
