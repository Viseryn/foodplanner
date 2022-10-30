/**
 * /assets/components/Forms.js
 */

import { Slider } from "@mui/material";
import React, { Component } from "react";


let inputRowStyle    = 'mb-6';
let inputLabelStyle  = 'text-sm font-semibold block mb-2';
let inputWidgetStyle = 'dark:placeholder-gray-400 dark:bg-[#121212] border border-gray-300 dark:border-none rounded-full h-10 px-6 shadow-sm w-full transition duration-300 focus:border-blue-600';
let textareaWidgetStyle = 'dark:placeholder-gray-400 dark:bg-[#121212] block border border-gray-300 dark:border-none rounded-xl px-4 py-2 shadow-sm w-full transition duration-300 focus:border-blue-600';


function nameFromId(id) {
    let arr = id?.split("_");
    let str = (arr?.length > 1) ? arr[0] + '[' + arr[1] + ']' : '';

    return str;
}


export function InputLabel({htmlFor = 'entity_name', label = 'Entity Name', ...labelProps}) {
    return(
        <label htmlFor={htmlFor} className={inputLabelStyle} {...labelProps}>
            {label}
        </label>
    );
}

export function InputWidget({id = 'entity_name', type = 'text', ...inputProps}) {
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

export default function InputRow({
    id = 'entity_name', 
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

export function TextareaWidget({id = 'entity_name', ...textareaProps}) {
    return (
        <textarea 
            id={id}
            name={nameFromId(id)}
            className={textareaWidgetStyle}
            {...textareaProps}
        ></textarea>
    );
}

export function TextareaRow({
    id = 'entity_name', 
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

export function SliderRow({
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

export function SelectWidget({id = 'entity_name', options = [], disabledOption = null, ...selectProps}) {
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

export function SelectRow({
    id = 'entity_name', 
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
