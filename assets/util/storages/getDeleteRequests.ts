import axios from 'axios'
import IngredientModel from '@/types/IngredientModel'

export default function getDeleteRequests(ingredientsToDelete: IngredientModel[]): Promise<void>[] {
    return ingredientsToDelete.map(async (ingredient: IngredientModel): Promise<void> => {
        await axios.delete(`/api/ingredients/${ingredient.id}`)
    })
}
