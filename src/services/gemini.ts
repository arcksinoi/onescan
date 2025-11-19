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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            return null;
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}
