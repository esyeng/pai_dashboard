import { useEffect } from "react";
import { debounce } from 'lodash';


// Hook that allows you to run a callback when the screen size changes
export const useWindowResize = (callback: () => any, screenSize: { minWidth?: number; maxWidth?: number; }) => {
    const { minWidth, maxWidth } = screenSize;
    useEffect(() => {
        // debounce to prevent too many calls
        const handleResize = debounce(() => {
            if (
                (typeof maxWidth !== "undefined" && window.innerWidth > maxWidth) ||
                (typeof minWidth !== "undefined" && window.innerWidth < minWidth)
            ) {
                callback();
            }
        }, 10);
        window.addEventListener("resize", handleResize);
        handleResize();
        // remove event listener when component unmounts
        return () => window.removeEventListener("resize", handleResize);
    }, [callback, minWidth, maxWidth]);
}
