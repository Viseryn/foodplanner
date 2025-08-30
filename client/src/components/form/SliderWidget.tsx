import { Form } from "@/types/forms/Form"
import { FormWidgetProps } from "@/types/props/FormWidgetProps"
import { validateFormWidgetProps } from "@/util/forms/validateFormWidgetProps"
import { Slider } from "@mui/material"
import { ReactElement } from "react"

type Mark = { value: number, label?: React.ReactNode }

type SliderWidgetProps<T extends Form> = FormWidgetProps<T> & {
    min: number
    max: number
    step: number
    marks?: Mark[]
}

/** @todo Write own Slider component */
export const SliderWidget = <T extends Form>(props: SliderWidgetProps<T>): ReactElement => {
    validateFormWidgetProps(props)
    validateSliderConfig(props)

    // Due to using a MUI Slider component, the onChangeHandler has a different signature than other widgets.
    const onChangeHandler = (_: Event, value: number | number[]): void => {
        props.setFormData(prev => ({
            ...prev,
            [props.field]: value,
        }))
    }

    // @ts-ignore
    const sliderValue: number = props.formData[props.field] ? +props.formData[props.field] : props.min

    return (
        <div className={"px-2"}>
            <Slider
                id={props.field}
                name={props.field}
                min={props.min}
                max={props.max}
                step={props.step}
                marks={props.marks ?? defaultMarks(props.min, props.max, props.step)}
                sx={{ color: "#2563EB" }}
                value={sliderValue}
                onChange={onChangeHandler}
            />
        </div>
    )
}

const validateSliderConfig = <T extends Form>(props: SliderWidgetProps<T>): void => {
    const { min, max, step, marks } = props
    if ((max - min) % step !== 0 || max <= min || marks && marks.length !== (max - min) / step + 1) {
        throw new Error("SliderWidget is not configured properly.")
    }
}

const defaultMarks = (min: number, max: number, step: number): Mark[] => {
    return [...Array((max - min) / step + 1)].map((_, index) => ({
        value: min + index * step,
        label: min + index * step,
    }))
}
