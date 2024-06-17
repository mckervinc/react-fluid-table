import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * check if the value is between two bounds
 * @param val value
 * @param start beginning
 * @param end terminating
 * @param options whether or not to show inclusivity
 * @returns boolean
 */
export const between = (
  val: number,
  start: number,
  end: number,
  options: {
    inclusive?: boolean;
    leftInclusive?: boolean;
    rightInclusive?: boolean;
  } = { inclusive: true }
) => {
  if (options.inclusive) {
    return val >= start && val <= end;
  }

  if (options.leftInclusive) {
    return val >= start && val < end;
  }

  if (options.rightInclusive) {
    return val > start && val <= end;
  }

  return val > start && val < end;
};
