/***********************************
 * ./assets/pages/Pantry/Pantry.js *
 ***********************************/

import React, { useEffect, useState }   from 'react'
import axios                            from 'axios'

import Item                             from './components/Item'
import AddItemInputWidget               from '../../components/ui/AddItemInputWidget'
import Button                           from '../../components/ui/Buttons/Button'
import Card                             from '../../components/ui/Card'
import Spacer                           from '../../components/ui/Spacer'
import Spinner                          from '../../components/ui/Spinner'

/**
 * Pantry
 * 
 * @todo
 * 
 * @component
 */
export default function Pantry({ pantry, ...props}) {
    /**
     * The order of the sorting button. If set to true, 
     * items will be sorted ascending, otherwise descending
     * (alphabetically).
     * 
     * @type {[boolean, function]}
     */
    const [sortingOrder, setSortingOrder] = useState(true);

    /**
     * The input value of the Add Item Widget at the top.
     * Will be passed to the AddItemInputWidget component
     * together with its setter method.
     * 
     * @type {[string, function]}
     */
    const [inputValue, setInputValue] = useState('')

    /**
     * handleEnterKeyDown
     * 
     * A function that is called when the enter key is 
     * pressed with the trimmed inputValue as argument.
     * Adds the argument to the ShoppingList via the 
     * ShoppingList Add API and reloads the list afterwards.
     * The reload is required because the API generates
     * IDs and other fields.
     * 
     * @param {string} value A trimmed string that describes an Ingredient object.
     */
    const handleEnterKeyDown = (value) => {
        // Clear input field
        setInputValue('')

        // Load new shopping list
        shoppingList.setLoading(true)

        // API call
        axios.post('/api/shoppinglist/add', [value])
    }

    // /**
    //  * handleCombine
    //  * 
    //  * Handler for combining items on the list with the same name.
    //  */
    // const handleCombine = () => {
    //     let list = [...props.pantry];  // Working copy of item list
    //     let appearedItems = []; // A list of "representative" items that all other duplicates are being added to
    //     let appearedNames = []; // The names of the representative items

    //     list.forEach(item => {
    //         if (!appearedNames.includes(item.originalName)) {
    //             // If item has not been saved as unique 
    //             // representative, save it now.
    //             appearedNames.push(item.originalName);
    //             appearedItems.push(item);
    //         } else {
    //             // If item is a duplicate, find the representative
    //             const index = appearedNames.indexOf(item.originalName);
    //             let origItem = appearedItems[index];

    //             if (origItem.quantity_unit === item.quantity_unit 
    //                 && !origItem.checked && !item.checked) {
    //                     // Convert fractions to floats
    //                     origItem.quantity_value = fractionToFloat(origItem.quantity_value);
    //                     item.quantity_value = fractionToFloat(item.quantity_value);

    //                 // If the representative has the same unit 
    //                 // and both are not checked, add them up.
    //                 origItem.quantity_value = +origItem.quantity_value + +item.quantity_value;
    //             } else {
    //                 // If either item is checked or units do not match, 
    //                 // add the "duplicate" to the representative list.
    //                 appearedNames.push(item.originalName);
    //                 appearedItems.push(item);
    //             }
    //         }
    //     });

    //     // In the list of representative items, generate the display names.
    //     appearedItems.forEach(item => {
    //         item.name = generateDisplayName(
    //             floatToFraction(item.quantity_value), 
    //             item.quantity_unit, 
    //             item.originalName
    //         );
    //     });

    //     // Update the state variable
    //     props.setPantry(appearedItems);
                
    //     // Refresh Data Timestamp
    //     axios.get('/api/refresh-data-timestamp/set')
    // };



    // /**
    //  * handleSort
    //  * 
    //  * Sorts all items by alphabet.
    //  */
    // const handleSort = () => {
    //     let items = [...props.pantry];

    //     // Sort array by alphabet (ascending or descending depending on state)
    //     items.sort((a, b) => {
    //         const textA = a.originalName.toLowerCase();
    //         const textB = b.originalName.toLowerCase();
    //         const returnValue = (textA < textB) ? -1 : (textA > textB) ? 1 : 0;

    //         return (sortingOrder ? 1 : -1) * returnValue;
    //     });

    //     // Give each item a correct position
    //     for (let i = 0; i < items.length; i++) {
    //        items[i].position = i + 1;
    //     }

    //     // Change sorting order
    //     setSortingOrder(sortingOrder => { return !sortingOrder; });

    //     // Update list
    //     props.setPantry(items);
                
    //     // Refresh Data Timestamp
    //     axios.get('/api/refresh-data-timestamp/set')
    // };



    // /**
    //  * handleDeleteItem
    //  * 
    //  * Deletes the given item from the list.
    //  * 
    //  * @param {*} id 
    //  */
    // const handleDeleteItem = (id) => {
    //     let items = [...props.pantry];
    //     const index = findItemById(id);

    //     // Remove the item
    //     items.splice(index, 1);

    //     // Update list
    //     props.setPantry(items);
                
    //     // Refresh Data Timestamp
    //     axios.get('/api/refresh-data-timestamp/set')
    // };



    /**
     * handleDeleteAll
     * 
     * Deletes all items on the list after confirming
     * a SweetAlert.
     */
    const handleDeleteAll = () => {
        swal({
            dangerMode: true,
            icon: 'error',
            title: 'Wirklich alle Zutaten löschen?',
            buttons: {
                cancel: 'Abbrechen',
                confirm: 'Löschen',
            },
        }).then((confirm) => {
            if (confirm) {
                axios.get('/api/pantry/delete-all')
                pantry.setLoading(true)
            }
        })
    }

    /**
     * Load layout
     */ 
    useEffect(() => {
        // Load sidebar
        props.setSidebar('pantry')

        // Load topbar
        props.setTopbar({
            title: 'Vorratskammer',
            actionButtons: [
                // { icon: 'sort', onClick: handleSort },
                { icon: 'delete_forever', onClick: handleDeleteAll },
            ],
            style: 'md:w-[450px]',
        })

        // Scroll to top
        window.scrollTo(0, 0)
    }, [])

    /**
     * Render Pantry
     */
    return (
        <div className="pb-24 md:pb-4 md:w-[450px]">
            <Spacer height="6" />

            <div className="mx-4 md:mx-0">
                <AddItemInputWidget
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    handleEnterKeyDown={handleEnterKeyDown}
                />
            </div>

            <Spacer height="10" />

            {pantry.isLoading ? (
                <Spinner /> /** @todo Add Skeleton here */
            ) : (
                <>
                    <Card style="mx-4 md:mx-0">
                        <div className="space-y-2 justify-center">
                            {pantry.data?.length === 0 &&
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <span className="material-symbols-rounded outlined mr-4">info</span>
                                        Die Vorratskammer ist leer.
                                    </div>
                                </div>
                            }

                            {pantry.data?.length > 0 &&
                                <>
                                    <Button
                                        //onClick={handleSort}
                                        label="Sortieren"
                                        icon="sort"
                                        role="secondary"
                                        small={true}
                                    />
                                    <Spacer height="2" />
                                </>
                            }

                            {pantry.data?.map(item =>
                                <Item
                                    key={item.id}
                                    pantry={pantry}
                                    item={item}
                                />
                            )}

                            {/* {props.pantry.map(item =>
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex justify-start">
                                        <div className="mr-2">
                                            <IconButton onClick={() => handleDeleteItem(item.id)} outlined={true}>delete_sweep</IconButton>
                                        </div>

                                        <div className="flex items-center">
                                            <div onClick={event => handleItemClick(event, item.id, item.editable)}>
                                                {item.editable ? (
                                                    <input 
                                                        className="bg-transparent border rounded-md"
                                                        defaultValue={item.name}
                                                        onBlur={event => handleItemNameChange(event, item.id)}
                                                        onKeyDown={event => { 
                                                            if (event.key === 'Enter') {
                                                                handleItemNameChange(event, item.id);
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    item.name
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <IconButton onClick={() => handlePositionChange(item.id, -1)}>expand_less</IconButton>
                                        <IconButton onClick={() => handlePositionChange(item.id, 1)}>expand_more</IconButton>
                                    </div>
                                </div>
                            )} */}
                        </div>
                    </Card>

                    {pantry.data?.length > 0 &&
                        <div className="flex justify-end mt-4 mx-4 md:mx-0">
                            <Button
                                //onClick={handleCombine}
                                label="Zutaten sammenfassen"
                                icon="low_priority"
                                role="tertiary"
                                small={true}
                            />
                        </div>
                    }
                </>
            )}
        </div>
    );
}
