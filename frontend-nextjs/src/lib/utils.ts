import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Convert relative image URL to full URL
export function getImageUrl(relativeUrl: string | undefined | null): string {
  if (!relativeUrl) return "/placeholder.svg";
  
  // If it's already a full URL, return as is
  if (relativeUrl.startsWith('http')) return relativeUrl;
  
  // If it's a relative URL starting with /, prepend backend URL
  if (relativeUrl.startsWith('/')) {
    return `${API_BASE_URL}${relativeUrl}`;
  }
  
  // If it's just a filename, prepend full uploads path
  return `${API_BASE_URL}/uploads/${relativeUrl}`;
}
