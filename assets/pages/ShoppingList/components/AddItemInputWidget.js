/****************************************************************
 * ./assets/pages/ShoppingList/components/AddItemInputWidget.js *
 ****************************************************************/

import React, { useState } from "react";
import axios from "axios";

import loadShoppingList from "../../../util/loadShoppingList";

/**
 * AddItemInputWidget
 * 
 * An input widget component for adding a new item 
 * to the shopping list. The input value is always 
 * monitored in the state variable inputValue. When 
 * the inputValue is non-empty, shows a little cross 
 * icon in the right to delete the current input.
 * When the enter key is pressed, calls the 
 * handleKeyDown function.
 * 
 * @component
 * @property {arr} items An array of shopping list items.
 * @property {function} setShoppingList
 * 
 * @example
 * <AddItemInputWidget items={props.shoppingList} {...props} />
 */
 export default function AddItemInputWidget(props) {
    /** @type {[string, function]} */
    const [inputValue, setInputValue] = useState('');

    /**
     * handleKeyDown
     * 
     * Handler for "enter" presses when the AddItemInputWidget
     * component is focused. Adds the input value as a new item 
     * and clears the input field.
     * 
     * @param {*} event
     */ 
    const handleKeyDown = (event) => {
        // Return if enter key was not pressed
        if (event.key !== 'Enter') return;

        // Only accept input if it consists of more than whitespaces
        if (inputValue.replace(/\s/g, '').length) {
            const newItem = { name: inputValue.trim() };

            // Send new item to database and reload list
            axios
                .post('/api/shoppinglist/ingredients', newItem)
                .then(() => {
                    // Clear input field
                    setInputValue('');

                    // Load new shopping list
                    loadShoppingList(props.setShoppingList);
                
                    // Refresh Data Timestamp
                    axios.get('/api/refresh-data-timestamp/set')
                })
            ;
        }
    };

    /**
     * Render
     */
    return (
        <div className="rounded-full font-semibold bg-secondary-200 dark:bg-secondary-dark-200 h-14 flex items-center pl-6 pr-4">
            <span className="material-symbols-rounded mr-2 cursor-default">add</span>

            <input 
                className="bg-secondary-200 dark:bg-secondary-dark-200 placeholder-secondary-900 dark:placeholder-secondary-dark-900 w-full border-transparent focus:border-transparent focus:ring-0"
                placeholder="Tippe eine neue Zutat ein ..."
                type="text"
                value={inputValue}
                onChange={e => {setInputValue(e.target.value)}} 
                onKeyDown={handleKeyDown}
            />

            {inputValue !== '' &&
                <span 
                    className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-secondary-300 dark:hover:bg-secondary-dark-300 p-2 rounded-full"
                    onClick={() => setInputValue('')}
                >
                    close
                </span>
            }
        </div>
    );
}
