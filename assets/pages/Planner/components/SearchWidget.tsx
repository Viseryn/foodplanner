/******************************************************
 * ./assets/pages/Planner/components/SearchWidget.tsx *
 ******************************************************/

import React from 'react'

/**
 * A component that renders a search bar. The inputValue state variable and its setter method need 
 * to be passed down by a parent component.
 * 
 * @component
 * @param props
 * @param props.inputValue A state variable for the input value.
 * @param props.setInputValue The setter method for inputValue.
 * @param props.placeholder An optional string for the placeholder of the input field. Default is 'Suche ...'.
 */
export default function SearchWidget({ inputValue, setInputValue, placeholder = 'Suche ...' }: {
    inputValue: string
    setInputValue: SetState<string>
    placeholder?: string
}): JSX.Element {
    // Render SearchWidget
    return <div className="rounded-xl flex items-center h-12 pl-6 pr-4 font-semibold bg-white dark:bg-secondary-dark-200">
        <span className="material-symbols-rounded mr-2 cursor-default">search</span>

        <input 
            className="bg-white dark:bg-secondary-dark-200 placeholder-[#55624c] dark:placeholder-secondary-dark-900 w-full border-transparent focus:border-transparent focus:ring-0"
            placeholder={placeholder}
            id="search"
            name="search"
            type="text"
            value={inputValue}
            onChange={e => {
                setInputValue(e.target.value)
            }} 
        />

        {inputValue !== '' &&
            <span 
                className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-secondary-100 dark:hover:bg-secondary-dark-100 p-2 rounded-full"
                onClick={() => setInputValue('')}
            >close</span>
        }
    </div>
}
