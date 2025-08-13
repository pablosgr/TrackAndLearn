import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export async function fetchLLMTestResponse(prompt: string): Promise<string | null> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    if (!response.text) {
        return null;
    }
    
    const cleanedResponse = response.text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    return cleanedResponse;
}
