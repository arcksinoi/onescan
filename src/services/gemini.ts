import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `
You are an expert One Piece TCG card scanner. 
Analyze the image and extract the card details. 
Return ONLY a valid JSON object with the following fields:
{
  "card_name": "Name of the card",
  "power": 5000 (integer, or null if none),
  "cost": 3 (integer, or null if none),
  "attribute": "Slash/Strike/etc",
  "type": "Character/Event/Stage",
  "color": "Red/Blue/etc",
  "effect_text": "Full text of the card effect",
  "set_code": "OP01-001"
}
If the image is not a One Piece TCG card or is too blurry to read, return null.
Do not include markdown formatting like \`\`\`json. Just the raw JSON object.
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
