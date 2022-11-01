/***************************************
 * ./assets/components/ShoppingList.js *
 ***************************************/

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Heading from './Heading';
import Spinner from './Util';
import Button from './Buttons';

/**
 * ShoppingList
 */
export default function ShoppingList(props) {
    // State variables
    const [isLoading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // Load sidebar and shopping list
    useEffect(() => {
        props.setSidebarActiveItem('shoppinglist');
        props.setSidebarActionButton();

        getShoppingList();
    }, []);

    /**
     * Get shopping list ingredients from API
     */ 
    const getShoppingList = () => {
        axios
            .get('/api/shoppinglist')
            .then(response => {
                let itemsData = JSON.parse(response.data)

                // Add more fields to shopping list
                itemsData.forEach(item => {
                    item.checked = false;
                });

                // Add list to state
                setItems(itemsData);
                setLoading(false);
            });
    };

    /**
     * Handler for "enter" presses
     */ 
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && inputValue !== '') {
            const newItem = {
                id: items.length,
                name: inputValue,
                position: 0,
                checked: false,
            };

            setItems([...items, newItem]);
            setInputValue('');
        }
    };

    /**
     * Handler for checkbox changes
     */ 
    const handleCheckboxChange = (id) => {
        // Create a new list of items
        let newList = [];

        // Note that the item id does not have to coincide 
        // with the index of the item in the list.
        // Therefore we need to count during the forEach.
        let i = 0;

        items.forEach(item => {
            newList.push(item);

            // Change the checked state of the selected item
            if (item.id === id) {
                newList[i].checked = !item.checked;
            }

            i++;
        });

        // Set new item list to the state variable
        setItems(newList);
    };

    /**
     * Handler for delete button
     */
    const handleDeleteButtonClicked = () => {
        const newList = items.filter(item => {
            return !item.checked;
        })

        setItems(newList);
    };

    /**
     * Handler for double click on item
     */
    const handleItemClick = (event, id) => {
        switch (event.detail) {
            case 2: {
                console.log('2 clicks');
                break;
            }
            default: {
                console.log('1 click');
                handleCheckboxChange(id);
                break;
            }
        }
    };

    // Render
    return (
        <div className="px-6 pb-24 pt-6 md:pb-6 md:my-6 md:mr-6 w-full min-h-screen md:min-h-fit bg-white dark:bg-[#29353f] md:rounded-3xl md:w-[450px]">
            <Heading>Einkaufsliste</Heading>
            
            <div className="mb-10 rounded-full bg-white border border-gray-100 dark:border-none dark:bg-[#1D252C] shadow-md h-16 flex items-center pl-6 pr-4">
                <span className="material-symbols-rounded mr-2 cursor-default">add</span>
                <input 
                    className="dark:bg-[#1D252C] dark:placeholder-gray-400 w-full border-transparent focus:border-transparent focus:ring-0"
                    placeholder="Tippe eine neue Zutat ein ..."
                    type="text"
                    value={inputValue}
                    onChange={e => {setInputValue(e.target.value)}} 
                    onKeyDown={handleKeyDown}
                />
                {inputValue !== '' &&
                    <span 
                        className="material-symbols-rounded ml-2 cursor-pointer transition duration-300 hover:bg-gray-200 dark:hover:bg-[#29353f] p-2 rounded-full"
                        onClick={() => setInputValue('')}
                    >close</span>
                }
            </div>

            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <div className="space-y-2">
                        {items.map(item => 
                            <div key={item.id} className="flex items-center w-full h-10 rounded-full px-4 transition duration-300 hover:bg-gray-100 dark:hover:bg-[#1D252C]">
                                <input 
                                    id={item.id} 
                                    type="checkbox" 
                                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded-full border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 peer"
                                    onChange={() => handleCheckboxChange(item.id)} 
                                    checked={item.checked}
                                />
                                <div 
                                    className={
                                        'transition duration-200 ml-4 text-gray-900 dark:text-gray-300 grow select-none' 
                                        + (item.checked ? ' line-through text-gray-400' : '')
                                    }
                                    onClick={event => {
                                        handleItemClick(event, item.id)
                                    }}
                                >
                                    {item.name}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end mt-10">
                        <Button
                            label="Alle gestrichenen Zutaten löschen"
                            style="transparent"
                            onClick={handleDeleteButtonClicked}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
