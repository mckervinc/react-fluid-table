import React, { useRef, useEffect, useCallback, useState } from "react";

interface AutoSizerProps {
  disableHeight?: boolean;
  disableWidth?: boolean;
  children: ({ height, width }: { height: number; width: number }) => React.ReactNode;
}

interface State {
  height: number | null;
  width: number | null;
}

const AutoSizer = ({ disableHeight, disableWidth, children }: AutoSizerProps) => {
  // hooks
  const ref = useRef<HTMLDivElement>(null);
  const prevSize = useRef({ width: window.innerWidth, height: window.innerHeight });
  const [dimensions, setDimensions] = useState<State>({ height: null, width: null });

  // variables
  const { height, width } = dimensions;

  // functions
  const calculateDimensions = useCallback(
    (event?: UIEvent) => {
      // base cases
      if (!ref.current || !ref.current.parentElement) {
        return;
      }

      // if resize was triggered but the window dimensions did not
      // change, return early
      if (event) {
        const { width: prevWidth, height: prevHeight } = prevSize.current;
        if (prevWidth === window.innerWidth && prevHeight === window.innerHeight) {
          return;
        }

        prevSize.current.width = window.innerWidth;
        prevSize.current.height = window.innerHeight;
      }

      if (disableHeight && disableWidth) {
        setDimensions({ height: 0, width: 0 });
        return;
      }

      // get style
      const parent = ref.current.parentElement;
      const style = window.getComputedStyle(parent);
      const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
      const paddingRight = parseInt(style.paddingRight, 10) || 0;
      const paddingTop = parseInt(style.paddingTop, 10) || 0;
      const paddingBottom = parseInt(style.paddingBottom, 10) || 0;

      // find new dimensions
      const newHeight = (parent.offsetHeight || 0) - paddingTop - paddingBottom;
      const newWidth = (parent.offsetWidth || 0) - paddingLeft - paddingRight;

      // update state
      if (newHeight !== height || newWidth !== width) {
        setDimensions({ height: newHeight, width: newWidth });
      }
    },
    [height, width, disableHeight, disableWidth]
  );

  // effects
  // on mount, calculate the dimensions
  useEffect(() => calculateDimensions(), []);

  // on resize, we have to re-calculate the dimensions
  useEffect(() => {
    window.addEventListener("resize", calculateDimensions);
    return () => {
      window.removeEventListener("resize", calculateDimensions);
    };
  }, [calculateDimensions]);

  return (
    <div ref={ref}>
      {height === null || width == null
        ? null
        : children({
            height: disableHeight ? 0 : height,
            width: disableWidth ? 0 : width
          })}
    </div>
  );
};

export default AutoSizer;
