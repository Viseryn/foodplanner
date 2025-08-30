import { useState } from "react"

type TimeoutHandler = {
    clearTimeout: () => void,
    startTimeout: () => void,
}

function useTimeout(
    callback: () => void,
    timeout: number,
): TimeoutHandler {
    const [customTimeout, setCustomTimeout]
        = useState<ReturnType<typeof setTimeout>>()

    return ({
        clearTimeout: () => clearTimeout(customTimeout),
        startTimeout: () => setCustomTimeout(setTimeout(callback, timeout)),
    })
}

export default useTimeout
