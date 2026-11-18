import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns true only for URLs that are safe to render as an external link
 * (http/https). Anything else (javascript:, data:, ftp:, etc.) is rejected so
 * stored career/linkedin/instagram URLs can never be turned into an executing
 * or unintended link.
 */
export function isSafeExternalUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}
