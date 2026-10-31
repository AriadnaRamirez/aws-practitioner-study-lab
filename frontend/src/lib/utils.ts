import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** True while the user has text highlighted (e.g. to copy it). */
export function hasTextSelection(): boolean {
  if (typeof window === "undefined") return false;
  return (window.getSelection()?.toString().trim().length ?? 0) > 0;
}
