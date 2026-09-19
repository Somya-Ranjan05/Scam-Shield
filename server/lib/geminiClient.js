// server/lib/geminiClient.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export const MODELS = {
  FAST_ANALYSIS: "gemini-2.0-flash",
  DEEP_ANALYSIS: "gemini-1.5-pro",
  AUDIO_TRANSCRIPTION: "gemini-2.0-flash",
};

let genAIInstance = null;

if (process.env.GEMINI_API_KEY) {
  genAIInstance = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
} else {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not set. Real-time Gemini calls will require a valid API key in server/.env");
}

export const genAI = genAIInstance;
