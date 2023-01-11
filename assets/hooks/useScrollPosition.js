/***************************************
 * ./assets/hooks/useScrollPosition.js *
 ***************************************/

import { useEffect, useState } from "react";

/**
 * useScrollPosition
 * 
 * @returns {number} Returns the current scroll position (on the vertical axis).
 */

const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const updatePosition = () => {
            setScrollPosition(window.pageYOffset);
        }

        window.addEventListener("scroll", updatePosition);
        updatePosition();

        return () => window.removeEventListener("scroll", updatePosition);
    }, []);

    return scrollPosition + window.innerHeight;
};

/** Export */
export default useScrollPosition;
