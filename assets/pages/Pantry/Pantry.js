/***********************************
 * ./assets/pages/Pantry/Pantry.js *
 ***********************************/

import React, { useEffect, useState }   from 'react'
import axios                            from 'axios'
import Fraction                         from 'fraction.js'

import Item                             from './components/Item'
import AddItemInputWidget               from '../../components/ui/AddItemInputWidget'
import Button                           from '../../components/ui/Buttons/Button'
import Card                             from '../../components/ui/Card'
import Spacer                           from '../../components/ui/Spacer'
import Spinner                          from '../../components/ui/Spinner'

import getFullIngredientName            from '../../util/getFullIngredientName'

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
     * Adds the argument to the Pantry via the 
     * Pantry Add API and reloads the list afterwards.
     * The reload is required because the API generates
     * IDs and other fields.
     * 
     * @param {string} value A trimmed string that describes an Ingredient object.
     */
    const handleEnterKeyDown = (value) => {
        // Clear input field
        setInputValue('')

        // Load new pantry list
        pantry.setLoading(true)

        // API call
        axios.post('/api/pantry/add', [value])
    }

    /**
     * handleAddUpIngredients
     * 
     * Combines items with the same name and same 
     * quantity_unit to a single item and adds up
     * the quantity_values. Since the items can contain
     * fractions, the Fraction class is imported and 
     * used. The resulting item list will be sent 
     * to the Pantry Replace API and a reload 
     * is done.
     */
    const handleAddUpIngredients = () => {
        // Make a copy of the pantry.data
        const copyOfList = [...pantry.data]

        // Create temporary map for ingredients.
        /** @type {Map<string, object>} */
        let ingredientMap = new Map()

        // Go through each ingredient
        copyOfList.forEach(ingredient => {
            // Check if the ingredient has been added to the ingredientMap yet
            if (ingredientMap.has(ingredient.name)) {
                // Get the ingredient from the map
                let currentIngredient = ingredientMap.get(ingredient.name);

                // Check if the quantity units match and the value is a number
                if (currentIngredient.quantity_unit === ingredient.quantity_unit
                    && ingredient.quantity_value) {
                    // Calculate the new quantity value.
                    // Note that the values may be fractions.
                    let currentVal = new Fraction(currentIngredient.quantity_value)
                    let newVal = new Fraction(ingredient.quantity_value)
                    let totalVal = currentVal.add(newVal)

                    // Save new quantity value in currentIngredient
                    currentIngredient.quantity_value = totalVal.toFraction(true)
                    ingredientMap.set(ingredient.name, currentIngredient)
                } else {
                    // If quantity units do not match or the value is not 
                    // a number, add the ingredient to the map with another key
                    ingredientMap.set(ingredient.name + ingredient.quantity_unit, ingredient)
                }
            } else {
                // If ingredient is not in the ingredientMap, add it
                ingredientMap.set(ingredient.name, ingredient)
            }
        })

        // Create a new pantry from the ingredientMap
        const newItemList = Array.from(ingredientMap.values())
        console.log(newItemList)

        // Create array of strings of ingredients for API
        const ingredients = []

        newItemList?.forEach(ingredient => {
            ingredients.push(getFullIngredientName(ingredient))
        })

        console.log('LIST',newItemList)
        console.log('MAP', ingredientMap)

        // API call
        axios.post('/api/pantry/replace', JSON.stringify(ingredients))
        pantry.setLoading(true)
    }

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
                        </div>
                    </Card>

                    {pantry.data?.length > 0 &&
                        <div className="flex justify-end mt-4 mx-4 md:mx-0">
                            <Button
                                onClick={handleAddUpIngredients}
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
