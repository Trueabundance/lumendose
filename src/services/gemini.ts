const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const generateGeminiInsight = async (prompt: string, imageBase64?: string): Promise<string | null> => {
    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API Key is missing.");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${GEMINI_API_KEY}`;

    let parts: any[] = [{ text: prompt }];
    if (imageBase64) {
        parts.push({ inlineData: { mimeType: "image/jpeg", data: imageBase64 } });
    }

    const payload = {
        contents: [{
            role: "user",
            parts: parts
        }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.error) {
            throw new Error(result.error.message || "Gemini API Error");
        }

        if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
            return result.candidates[0].content.parts[0].text;
        }

        console.warn("Gemini unexpected response:", result);
        return null;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};
