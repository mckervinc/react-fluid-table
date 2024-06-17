import { cn } from "@/lib/utils";

const InlineCode = ({ className, ...rest }: React.HTMLProps<HTMLSpanElement>) => (
  <span
    className={cn(
      "whitespace-pre rounded-[0.28571429rem] px-[0.2em] text-[#50f97a] text-[rgba(40,42,54,0.75)]",
      className
    )}
    {...rest}
  />
);

export { InlineCode };
