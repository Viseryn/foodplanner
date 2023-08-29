import React, { ReactElement } from 'react'

export default function InfoPantryEmpty(): ReactElement {
    return <div className="flex justify-between items-center">
        <div className="flex items-center">
            <span className="material-symbols-rounded outlined mr-4">info</span>
            Die Vorratskammer ist leer.
        </div>
    </div>
}