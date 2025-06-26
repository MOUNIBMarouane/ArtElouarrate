import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert relative image URL to full URL
export function getImageUrl(relativeUrl: string | undefined | null): string {
  if (!relativeUrl) return "/placeholder.svg";
  
  // If it's already a full URL, return as is
  if (relativeUrl.startsWith('http')) return relativeUrl;
  
  // If it's a relative URL starting with /, prepend backend URL
  if (relativeUrl.startsWith('/')) {
    return `http://localhost:3000${relativeUrl}`;
  }
  
  // If it's just a filename, prepend full uploads path
  return `http://localhost:3000/uploads/${relativeUrl}`;
}
