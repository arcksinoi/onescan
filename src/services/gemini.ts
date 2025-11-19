import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are an expert One Piece TCG card scanner. 
Analyze the image and extract the card details based on the following official anatomy:

1. **Cost**: Number inside a circle at the top-left. (Leader cards have no cost).
2. **Attribute**: Icon next to the cost (Strike/Slash/Ranged/Special/Wisdom).
3. **Power**: Large number at the top-right (e.g., 5000). Events/Stages have no power.
4. **Counter**: Lightning icon with a number on the left side (e.g., +1000).
5. **Life**: Number at the bottom-right (ONLY for Leader cards).
6. **Effect Text**: Center text box. Look for keywords like [Trigger], [Blocker], [Rush].
7. **Type/Tags**: Text below the effect box (e.g., Straw Hat Crew, Supernovas). Return as an array of strings.
8. **Color**: Defined by the border/background (Red, Blue, Green, etc.). Leaders can be dual-colored (e.g., "Red/Green").
9. **Set Code**: Bottom-right corner (e.g., OP01-001).
10. **Rarity**: Letter next to the set code (L, C, UC, R, SR, SEC).

Return ONLY a valid JSON object with the following fields:
{
  "card_name": "Name of the card",
  "power": 5000 (integer, or null if none),
  "cost": 3 (integer, or null if none),
  "attribute": "Strike",
  "type": "Character",
  "color": "Red",
  "effect_text": "Full text...",
  "set_code": "OP01-001",
  "rarity": "SR",
  "counter": 1000 (integer, or null if none),
  "life": 4 (integer, or null if none),
  "tags": ["Straw Hat Crew", "Supernovas"]
}
If the image is not a One Piece TCG card or is too blurry, return null.
Do not include markdown formatting. Just the raw JSON.
`;

export async function identifyCard(apiKey: string, imageBase64: string) {
    if (!apiKey) throw new Error("API Key is missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    try {
        // Remove header if present (e.g., "data:image/jpeg;base64,")
        const base64Data = imageBase64.split(',')[1] || imageBase64;

        const result = await model.generateContent([
            SYSTEM_PROMPT,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        try {
            // Clean up potential markdown
            let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            // Find the first '{' and last '}' to ensure we only parse the JSON object
            const firstOpen = cleanText.indexOf('{');
            const lastClose = cleanText.lastIndexOf('}');

            if (firstOpen !== -1 && lastClose !== -1) {
                cleanText = cleanText.substring(firstOpen, lastClose + 1);
            }

            return JSON.parse(cleanText);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            console.error("Parse error:", e);
            return null;
        }
    } catch (error: any) {
        console.error("Gemini API Error:", error);

        // Enhance error message for common issues
        if (error.message?.includes("401") || error.message?.includes("API key")) {
            throw new Error("Invalid API Key. Please check your settings.");
        }
        if (error.message?.includes("429") || error.message?.includes("quota")) {
            throw new Error("API Quota Exceeded. Try again later.");
        }
        if (error.message?.includes("SAFETY")) {
            throw new Error("Blocked by Safety Filters. Try a different angle.");
        }

        throw error;
    }
}
