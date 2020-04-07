import { useRef, useEffect, useCallback } from "react";

const useResize = (callback: Function, debounce: number) => {
  const resizeRef = useRef(0);

  const onResize = useCallback(() => {
    if (resizeRef.current) {
      window.clearTimeout(resizeRef.current);
    }

    resizeRef.current = window.setTimeout(callback, debounce);
  }, [callback, debounce]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      if (resizeRef.current) {
        window.clearTimeout(resizeRef.current);
      }

      window.removeEventListener("resize", onResize);
    };
  }, [onResize, resizeRef]);
};

export default useResize;
