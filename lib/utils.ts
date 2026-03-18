import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractJson(str: string): any {
  if (!str) throw new Error("Empty AI response");
  
  try {
    // 1. Try simple parse if the whole string is JSON
    return JSON.parse(str.trim().replace(/```json|```/g, ""));
  } catch (e) {
    // 2. Try to find the first '{' and the last '}'
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');
    
    if (start !== -1 && end !== -1 && end > start) {
      try {
        const jsonStr = str.substring(start, end + 1);
        return JSON.parse(jsonStr);
      } catch (innerError) {
        console.error("Error parsing substring as JSON:", innerError);
      }
    }
    
    // 3. Last resort: try to clean and parse again if it looks like a warning but has JSON inside
    console.error("Error extracting JSON from AI response:", e);
    console.log("Original string:", str);
    throw new Error("Could not parse AI response as JSON. The AI might be returning a warning or empty content.");
  }
}
