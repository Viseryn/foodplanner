/****************************************************************
 * ./assets/pages/ShoppingList/components/AddItemInputWidget.js *
 ****************************************************************/

import React from "react";

/**
 * AddItemInputWidget
 * 
 * An input widget component for adding a new item 
 * to the shopping list. The input value is always 
 * monitored in the state variable inputValue. When 
 * the inputValue is non-empty, shows a little cross 
 * icon in the right to delete the current input.
 * When the enter key is pressed, calls the 
 * handleNewItemKeyDown function.
 * 
 * @component
 * @property {arr} items The state array of shopping list items.
 * @property {string} inputValue The state variable that contains the input value.
 * @property {function} setInputValue The setter method of inputValue.
 * @property {function} handleNewItemKeyDown A function that handles enter key presses.
 * 
 * @example
 * <AddItemInputWidget
 *     items={items}
 *     inputValue={inputValue}
 *     setInputValue={setInputValue}
 *     handleNewItemKeyDown={handleNewItemKeyDown}
 * />
 */
 export default function AddItemInputWidget(props) {
    return (
        <div className={'rounded-full bg-white border border-gray-100 dark:border-none dark:bg-[#1D252C] shadow-md h-16 flex items-center pl-6 pr-4' + (props.items.length > 0 ? ' mb-10' : '')}>
            <span className="material-symbols-rounded mr-2 cursor-default">add</span>

            <input 
                className="dark:bg-[#1D252C] dark:placeholder-gray-400 w-full border-transparent focus:border-transparent focus:ring-0"
                placeholder="Tippe eine neue Zutat ein ..."
                type="text"
                value={props.inputValue}
                onChange={e => {props.setInputValue(e.target.value)}} 
                onKeyDown={props.handleNewItemKeyDown}
            />

            {props.inputValue !== '' &&
                <span 
                    className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-gray-200 dark:hover:bg-[#29353f] p-2 rounded-full"
                    onClick={() => props.setInputValue('')}
                >
                    close
                </span>
            }
        </div>
    );
}