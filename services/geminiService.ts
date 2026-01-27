
import { GoogleGenAI } from "@google/genai";
import { DOCENT_PROMPT } from "../constants";

export class GeminiService {
  constructor() {}

  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async chatWithHalbae(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
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

  // Google Search Grounding을 활용한 장소 정보 검색
  async getPlaceSearchInfo(placeName: string) {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `부산의 명소 '${placeName}'에 대한 최신 소식, 역사적 배경, 방문객들이 알아야 할 꿀팁과 대략적인 정보를 요약해서 알려줘.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      // Search Grounding 결과에서 웹 URL 추출 (MUST ALWAYS)
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = chunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title || "더 자세히 알아보기",
          uri: chunk.web?.uri || ""
        }))
        .filter(link => link.uri !== "");

      return { text, links };
    } catch (error) {
      console.error("Search Grounding Error:", error);
      return { text: "검색 정보를 가져오는 데 실패했습니다.", links: [] };
    }
  }

  // 기존 Maps Grounding 함수 (필요 시 유지)
  async getPlaceGrounding(placeName: string) {
    try {
      const ai = this.getClient();
      let lat = 35.1796;
      let lng = 129.0756;

      if (navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej)
        ).catch(() => null);
        if (pos) {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
        }
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${placeName}에 대한 최신 정보와 역사적 의미를 알려줘.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lng
              }
            }
          }
        },
      });

      const text = response.text || "";
      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.filter(chunk => chunk.maps)
        ?.map(chunk => ({
          title: chunk.maps?.title || "지도에서 보기",
          uri: chunk.maps?.uri
        })) || [];

      return { text, links };
    } catch (error) {
      console.error("Maps Grounding Error:", error);
      return { text: "정보를 가져오는 데 실패했습니다.", links: [] };
    }
  }
}

export const geminiService = new GeminiService();
