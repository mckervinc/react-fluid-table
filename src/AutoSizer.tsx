import React, { useCallback, useEffect, useRef, useState } from "react";

interface AutoSizerProps {
  disableHeight?: boolean;
  disableWidth?: boolean;
  children: ({ height, width }: { height: number; width: number }) => React.ReactNode;
}

/**
 * This is a skinny AutoSizer based on react-virtualized-auto-sizer.
 * This removes the `bailout` functionality in order to allow the Table
 * to generate its own height. This also ignores a resize if the
 * dimensions of the window did not actually change (one less render).
 */
const AutoSizer = ({ disableHeight, disableWidth, children }: AutoSizerProps) => {
  // hooks
  const resizeRef = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  // variables
  const { height, width } = dimensions;

  // functions
  const calculateDimensions = useCallback(() => {
    // base cases
    if (!ref.current?.parentElement) {
      return;
    }

    // get style
    const parent = ref.current.parentElement;
    const style = window.getComputedStyle(parent);
    const paddingLeft = parseInt(style.paddingLeft) || 0;
    const paddingRight = parseInt(style.paddingRight) || 0;
    const paddingTop = parseInt(style.paddingTop) || 0;
    const paddingBottom = parseInt(style.paddingBottom) || 0;

    // find new dimensions
    const newHeight = (parent.offsetHeight || 0) - paddingTop - paddingBottom;
    const newWidth = (parent.offsetWidth || 0) - paddingLeft - paddingRight;

    // update state
    setDimensions({ height: newHeight, width: newWidth });
  }, [height, width, disableHeight, disableWidth]);

  const onResize = useCallback(() => {
    window.clearTimeout(resizeRef.current);
    resizeRef.current = window.setTimeout(calculateDimensions, 40);
  }, [calculateDimensions]);

  // effects
  // on mount, calculate the dimensions
  useEffect(() => calculateDimensions(), []);

  // on resize, we have to re-calculate the dimensions
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(resizeRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [onResize, resizeRef]);

  return (
    <div ref={ref}>
      {height || width
        ? children({
            height: disableHeight ? 0 : height,
            width: disableWidth ? 0 : width
          })
        : null}
    </div>
  );
};

export default AutoSizer;
