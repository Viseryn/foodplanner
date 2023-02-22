/*************************************************
 * ./assets/components/ui/AddItemInputWidget.tsx *
 *************************************************/

import React from 'react'

/**
 * AddItemInputWidget
 * 
 * An input widget component for adding a new item 
 * to a list. The input value of the widget
 * is stored in the state variable inputValue of the 
 * parent component. When using this component one 
 * must pass a enter key down event handler that takes 
 * the (trimmed) inputValue as parameter.
 * 
 * @component
 * @param props
 * @param props.inputValue A state variable that stores the current user input value.
 * @param props.setInputValue The setter method for the state variable inputValue.
 * @param props.handleEnterKeyDown A function that is called when the enter key is pressed. The trimmed inputValue is passed as argument.
 * @param props.placeholder The placeholder text of the widget. Default is 'Tippe eine Zutat ein ...'.
 */
 export default function AddItemInputWidget({ 
    inputValue, 
    setInputValue, 
    handleEnterKeyDown, 
    placeholder = 'Tippe eine Zutat ein ...'
}: {
    inputValue: string
    setInputValue: React.Dispatch<React.SetStateAction<string>>
    handleEnterKeyDown: (inputValue: string) => void
    placeholder?: string
}): JSX.Element {
    /**
     * handleKeyDown
     * 
     * Handles all keyboard presses. On enter presses the 
     * function checks whether the inputValue is more than 
     * whitespace, and if yes, will call the argument 
     * function handleEnterKeyDown from the parent component
     * with the trimmed inputValue as argument.
     * 
     * @param event A keyboard event.
     */ 
    const handleKeyDown = (event: React.KeyboardEvent): void => {
        // Return if enter key was not pressed
        if (event.key !== 'Enter') {
            return
        }

        // Only accept input if it consists of more than whitespaces
        if (inputValue.trim().length > 0) {
            // Execute argument event handler with trimmed inputValue
            handleEnterKeyDown(inputValue.trim())
        }
    }

    /**
     * Render AddItemInputWidget
     */
    return (
        <div className="rounded-full font-semibold bg-secondary-200 dark:bg-secondary-dark-200 h-14 flex items-center pl-6 pr-4">
            <span className="material-symbols-rounded mr-2 cursor-default">add</span>

            <input 
                className="bg-secondary-200 dark:bg-secondary-dark-200 placeholder-secondary-900 dark:placeholder-secondary-dark-900 w-full border-transparent focus:border-transparent focus:ring-0"
                placeholder={placeholder}
                type="text"
                value={inputValue}
                onChange={e => {setInputValue(e.target.value)}} 
                onKeyDown={handleKeyDown}
            />

            {inputValue &&
                <span 
                    className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-secondary-300 dark:hover:bg-secondary-dark-300 p-2 rounded-full"
                    onClick={() => setInputValue('')}
                >
                    close
                </span>
            }
        </div>
    )
}
