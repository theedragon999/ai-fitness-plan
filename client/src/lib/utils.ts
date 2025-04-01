import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a string with thousands separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Parses CSV string into an array of objects
 */
export function parseCSV(csv: string): Record<string, any>[] {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).map(line => {
    if (!line.trim()) return null;
    
    const values = line.split(',').map(value => value.trim());
    const entry: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      // Try to convert numbers
      entry[header] = isNaN(Number(value)) ? value : Number(value);
    });
    
    return entry;
  }).filter(Boolean);
}

/**
 * Calculate activity level based on steps and workout minutes
 */
export function calculateActivityLevel(steps: number, workoutMinutes: number): string {
  const score = (steps / 10000) + (workoutMinutes / 150);
  
  if (score < 0.5) return "Sedentary";
  if (score < 1) return "Lightly Active";
  if (score < 1.5) return "Moderately Active";
  if (score < 2) return "Very Active";
  return "Extremely Active";
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get a random value between min and max
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
