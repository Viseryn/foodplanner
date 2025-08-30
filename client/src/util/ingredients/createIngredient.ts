import { Detached } from "@/types/api/Detached"
import { Ingredient } from "@/types/api/Ingredient"

/**
 * Creates a detached `Ingredient` object from a string using regular expressions.
 */
export const createIngredient = (ingredient: string, position?: number): Detached<Ingredient> => {
    return {
        "@type": "Ingredient",
        name: getQuantityUnitAndName(ingredient)[1],
        quantityValue: getQuantityValueAndRest(ingredient)[0],
        quantityUnit: getQuantityUnitAndName(ingredient)[0],
        position: position,
    }
}

function getQuantityValueAndRest(ingredient: string): [string, string] {
    if (!isNaN(Number(ingredient))) {
        return ["", ingredient]
    }

    const matches = ingredient.match(/^([\d./]*\s*)(\D+)(.*)/)
    return [
        (matches?.[1] ?? "").trim(), // quantityValue
        (matches?.[2] ?? "") + (matches?.[3] ?? "").trim(), // quantityUnit and name
    ]
}

function getQuantityUnitAndName(ingredient: string): [string, string] {
    const allowedUnits = [
        "gehäufter TL", "gehäufte TL", "gehäufter EL", "gehäufte EL", "gehäufter Teelöffel", "gehäufte Teelöffel",
        "gehäufter Esslöffel", "gehäufte Esslöffel", "n. B.", "g", "kg", "ml", "l", "EL", "TL", "Tube", "Tuben", "Bund",
        "Bünde", "Glas", "Gläser", "Packung", "Packungen", "kl. Glas", "kleines Glas", "kl. Gläser", "kleine Gläser",
        "Becher", "Päckchen", "Pck.", "Msp.", "Liter", "Messerspitze", "Messerspitzen", "Prise", "Prisen", "Würfel",
        "Stange", "Stangen", "Paket", "Pakete", "Beutel", "Zweig", "Zweige", "Zehe", "Zehen",
    ]

    const unitAndName = getQuantityValueAndRest(ingredient)[1]
    const regex = new RegExp(`^((?:${allowedUnits.join("|")})\\s+)?(.*)`)
    const matches = unitAndName.match(regex)

    return [
        (matches?.[1] ?? "").trim(), // quantityUnit
        (matches?.[2] ?? "").trim().replace(/\s+/g, " "), // name (without extra whitespaces)
    ]
}
