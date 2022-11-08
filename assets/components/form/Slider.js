/**************************************
 * ./assets/components/form/Slider.js *
 **************************************/

import React from "react";

import { Slider } from "@mui/material";

import { nameFromId, inputRowStyle } from "./Forms";
import { InputLabel } from "./Input";

/**
 * SliderRow
 * 
 * A component that renders a label and slider input field in a div-container.
 * 
 * @component
 * @property {string} id The id of the slider field.
 * @property {*} labelProps An optional object of props for the <label> element.
 * @property {*} sliderProps An optional object of props for the <Slider> element.
 * @property {*} rowProps An optional object of props for the <div> container.
 * 
 * @example
 * <SliderRow
 *     id="recipe_name"
 *     labelProps={{
 *         className: 'text-lg',
 *     }}
 *     sliderProps={{
 *         min: 1, 
 *         max: 10,
 *     }}
 *     className="mb-10"
 * />
 */
function SliderRow({
    id = 'entity_name', 
    labelProps = {}, 
    sliderProps = {}, 
    ...rowProps
}) {
    return (
        <div className={rowProps.className !== undefined ? rowProps.className : inputRowStyle}>
            {rowProps.label !== undefined && <InputLabel id={id} label={rowProps.label} {...labelProps} />}
            <div className="px-2">
                <Slider
                    id={id}
                    name={nameFromId(id)}
                    sx={{
                        color: '#2563EB'
                    }}
                    {...sliderProps}
                />
            </div>
        </div>
    );
}

/**
 * Export components
 */
export { SliderRow };