import { useRef, useEffect, useCallback } from "react";

const useResize = (func: Function, wait: number) => {
  const resizeRef = useRef(0);

  const onResize = useCallback(() => {
    window.clearTimeout(resizeRef.current);

    resizeRef.current = window.setTimeout(func, wait);
  }, [func, wait]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(resizeRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [onResize, resizeRef]);
};

export default useResize;
