/****************************************
 * ./assets/components/form/Textarea.js *
 ****************************************/

import React from "react";

import { nameFromId, inputRowStyle, textareaWidgetStyle } from "./Forms";
import { InputLabel } from "./Input";

/**
 * TextareaWidget
 * 
 * A component that renders a textarea field.
 * 
 * @component
 * @property {string} id The id of the textarea field.
 * @property {*} textareaProps An optional object of props for the <textarea> element.
 * 
 * @example
 * <TextareaWidget
 *     id="recipe_ingredients"
 *     className="rounded-full"
 * />
 */
function TextareaWidget({id, ...textareaProps}) {
    return (
        <textarea 
            id={id}
            name={nameFromId(id)}
            className={textareaWidgetStyle}
            {...textareaProps}
        ></textarea>
    );
}

/**
 * TextareaRow
 * 
 * A component that renders a label and textarea field in a div-container.
 * 
 * @component
 * @property {string} id The id of the textarea field.
 * @property {*} labelProps An optional object of props for the <label> element.
 * @property {*} textareaProps An optional object of props for the <textarea> element.
 * @property {*} rowProps An optional object of props for the <div> container.
 * 
 * @example
 * <TextareaRow
 *     id="recipe_ingredients"
 *     labelProps={{
 *         className: 'text-lg',
 *     }}
 *     className="mb-10"
 * />
 */
function TextareaRow({
    id, 
    labelProps = {}, 
    textareaProps = {}, 
    ...rowProps
}) { 
    return (
        <div className={rowProps.className !== undefined ? rowProps.className : inputRowStyle}>
            {rowProps.label !== undefined && <InputLabel id={id} label={rowProps.label} {...labelProps} />}
            <TextareaWidget id={id} {...textareaProps} />
        </div>
    );
}

/**
 * Export components
 */
export { TextareaWidget, TextareaRow };
