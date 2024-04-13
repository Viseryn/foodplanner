import { Optional } from "@/types/Optional"
import { useEffect, useRef } from "react"

export const useFindEntityById = <T extends { id: number }>(
    id: Optional<string> | number,
    entities: EntityState<T[]>,
): Optional<T> => {
    const wantedEntity = useRef<Optional<T>>()

    useEffect(() => {
        if (entities.isLoading) {
            return
        }

        wantedEntity.current = entities.data.find(
            entity => entity.id == id
        )
    }, [entities])

    return wantedEntity.current
}
