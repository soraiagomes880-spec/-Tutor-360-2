
import { GoogleGenAI } from '@google/genai';

export const getGeminiKey = (): string | null => {
    // 1. Prioridade para variáveis de ambiente (Vercel/Vite)
    const envKey = (process.env as any).VITE_API_KEY || (process.env as any).API_KEY;
    if (envKey && envKey !== 'undefined') return envKey;

    // 2. Fallback para localStorage (Manual/Secret Setup)
    if (typeof window !== 'undefined') {
        return localStorage.getItem('gemini_api_key');
    }
    return null;
};

export const saveGeminiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
};
