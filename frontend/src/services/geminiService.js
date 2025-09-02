import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

const systemInstruction = {
  role: "system",
  parts: [
    {
      text: "You are a professional AI legal assistant named CounselDesk. Your primary purpose is to provide helpful, general legal information and guidance. You are NOT a licensed attorney, and your advice does not constitute legal opinion or legal advice. You must ALWAYS start your response with a clear, concise legal disclaimer. For example: 'Disclaimer: I am an AI legal assistant, not a lawyer. My advice is for informational purposes only and does not constitute a legal opinion.'",
    },
  ],
};


export const generateContent = async (message) => {
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      systemInstruction: systemInstruction,
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Sorry, I am unable to provide a response at this time.");
  }
};

