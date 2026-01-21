
import { GoogleGenAI } from "@google/genai";
import { DOCENT_PROMPT } from "../constants";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async chatWithHalbae(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: DOCENT_PROMPT,
          temperature: 0.8,
          topP: 0.95,
        }
      });

      return response.text || "에고, 할배가 잠깐 딴생각을 했네. 다시 말해줄래?";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "할배가 목이 좀 아프네. 나중에 다시 이야기하자꾸나.";
    }
  }
}

export const geminiService = new GeminiService();
