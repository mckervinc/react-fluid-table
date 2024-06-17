import { cn, between } from "@/lib/utils";
import React from "react";

export type ColProps = React.HTMLProps<HTMLDivElement> & {
  xs?: number | true | "auto";
  sm?: number | true | "auto";
  md?: number | true | "auto";
  lg?: number | true | "auto";
  xl?: number | true | "auto";
  xxl?: number | true | "auto";
};

const widths = {
  xs: [
    "w-1/12",
    "w-2/12",
    "w-3/12",
    "w-4/12",
    "w-5/12",
    "w-6/12",
    "w-7/12",
    "w-8/12",
    "w-9/12",
    "w-10/12",
    "w-11/12",
    "w-12/12"
  ],
  sm: [
    "sm:w-1/12",
    "sm:w-2/12",
    "sm:w-3/12",
    "sm:w-4/12",
    "sm:w-5/12",
    "sm:w-6/12",
    "sm:w-7/12",
    "sm:w-8/12",
    "sm:w-9/12",
    "sm:w-10/12",
    "sm:w-11/12",
    "sm:w-12/12"
  ],
  md: [
    "md:w-1/12",
    "md:w-2/12",
    "md:w-3/12",
    "md:w-4/12",
    "md:w-5/12",
    "md:w-6/12",
    "md:w-7/12",
    "md:w-8/12",
    "md:w-9/12",
    "md:w-10/12",
    "md:w-11/12",
    "md:w-12/12"
  ],
  lg: [
    "lg:w-1/12",
    "lg:w-2/12",
    "lg:w-3/12",
    "lg:w-4/12",
    "lg:w-5/12",
    "lg:w-6/12",
    "lg:w-7/12",
    "lg:w-8/12",
    "lg:w-9/12",
    "lg:w-10/12",
    "lg:w-11/12",
    "lg:w-12/12"
  ],
  xl: [
    "xl:w-1/12",
    "xl:w-2/12",
    "xl:w-3/12",
    "xl:w-4/12",
    "xl:w-5/12",
    "xl:w-6/12",
    "xl:w-7/12",
    "xl:w-8/12",
    "xl:w-9/12",
    "xl:w-10/12",
    "xl:w-11/12",
    "xl:w-12/12"
  ],
  xxl: [
    "xxl:w-1/12",
    "xxl:w-2/12",
    "xxl:w-3/12",
    "xxl:w-4/12",
    "xxl:w-5/12",
    "xxl:w-6/12",
    "xxl:w-7/12",
    "xxl:w-8/12",
    "xxl:w-9/12",
    "xxl:w-10/12",
    "xxl:w-11/12",
    "xxl:w-12/12"
  ]
};

export const Col = ({
  className,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  ...rest
}: ColProps) => {
  const anySize = !!xs || !!sm || !!md || !!lg || !!xl || !!xxl;
  return (
    <div
      className={cn(
        "w-full max-w-full px-[calc(1.5rem*.5)]",
        !anySize && "flex-[1_0_0%]",
        xs === "auto" && "w-auto flex-[0_0_auto]",
        typeof xs === "boolean" && "flex-[1_0_0%]",
        typeof xs === "number" &&
          between(xs, 1, 12) &&
          `flex-[0_0_auto] ${widths.xs[xs - 1]}`,
        sm === "auto" && "sm:w-auto sm:flex-[0_0_auto]",
        typeof sm === "boolean" && "sm:flex-[1_0_0%]",
        typeof sm === "number" &&
          between(sm, 1, 12) &&
          `sm:flex-[0_0_auto] ${widths.sm[sm - 1]}`,
        md === "auto" && "md:w-auto md:flex-[0_0_auto]",
        typeof md === "boolean" && "md:flex-[1_0_0%]",
        typeof md === "number" &&
          between(md, 1, 12) &&
          `md:flex-[0_0_auto] ${widths.md[md - 1]}`,
        lg === "auto" && "lg:w-auto lg:flex-[0_0_auto]",
        typeof lg === "boolean" && "lg:flex-[1_0_0%]",
        typeof lg === "number" &&
          between(lg, 1, 12) &&
          `lg:flex-[0_0_auto] ${widths.lg[lg - 1]}`,
        xl === "auto" && "xl:w-auto xl:flex-[0_0_auto]",
        typeof xl === "boolean" && "xl:flex-[1_0_0%]",
        typeof xl === "number" &&
          between(xl, 1, 12) &&
          `xl:flex-[0_0_auto] ${widths.xl[xl - 1]}`,
        xxl === "auto" && "xxl:w-auto xxl:flex-[0_0_auto]",
        typeof xxl === "boolean" && "xxl:flex-[1_0_0%]",
        typeof xxl === "number" &&
          between(xxl, 1, 12) &&
          `xxl:flex-[0_0_auto] ${widths.xxl[xxl - 1]}`,
        className
      )}
      {...rest}
    />
  );
};
