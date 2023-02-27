/*******************************************
 * ./assets/pages/Recipes/SearchWidget.tsx *
 *******************************************/

import React from 'react'

/**
 * SearchWidget
 * 
 * A component that renders a search bar.
 * The inputValue state variable and its setter 
 * method need to be passed down by a parent 
 * component.
 * 
 * @component
 * @property {string} inputValue A state variable for the input value.
 * @property {React.Dispatch<React.SetStateAction<string>>} setInputValue The setter method for inputValue.
 * @property {string} placeholder An optional string for the placeholder of the input field. Default is 'Suche ...'.
 */
export default function SearchWidget({ 
    inputValue, 
    setInputValue, 
    placeholder = 'Suche ...',
}) {
    /**
     * Render SearchWidget
     */
    return (
        <div className="rounded-full flex items-center h-14 pl-6 pr-4 font-semibold bg-secondary-100 dark:bg-secondary-dark-100">
            <span className="material-symbols-rounded mr-2 cursor-default">search</span>

            <input 
                className="bg-secondary-100 dark:bg-secondary-dark-100 placeholder-[#55624c] dark:placeholder-secondary-dark-300 w-full border-transparent focus:border-transparent focus:ring-0"
                placeholder={placeholder}
                id='search'
                name='search'
                type='text'
                value={inputValue}
                onChange={e => {
                    setInputValue(e.target.value);
                }} 
            />

            {inputValue !== '' &&
                <span 
                    className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-secondary-200 dark:hover:bg-secondary-dark-200 p-2 rounded-full"
                    onClick={() => setInputValue('')}
                >close</span>
            }
        </div>
    )
}