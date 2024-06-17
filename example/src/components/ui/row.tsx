import { cn } from "@/lib/utils";
import React from "react";

export const Row = ({
  className,
  ...rest
}: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn("mx-[calc(-.5*1.5rem)] mt-0 flex flex-wrap", className)}
      {...rest}
    />
  );
};
