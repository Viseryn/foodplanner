/***************************************
 * ./assets/hooks/useScrollPosition.js *
 ***************************************/

import { useEffect, useState } from "react";

/**
 * useScrollPosition
 * 
 * @param {boolean} withoutInnerHeight If set to false (default), the inner height of the window is added to the scroll value.
 * @returns {number} Returns the current scroll position (on the vertical axis) plus maybe the inner height of the window.
 */

const useScrollPosition = (withoutInnerHeight = false) => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const updatePosition = () => {
            setScrollPosition(window.pageYOffset);
        }

        window.addEventListener("scroll", updatePosition);
        updatePosition();

        return () => window.removeEventListener("scroll", updatePosition);
    }, []);

    return withoutInnerHeight ? scrollPosition : scrollPosition + window.innerHeight;
};

/** Export */
export default useScrollPosition;
