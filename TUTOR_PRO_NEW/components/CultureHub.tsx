import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import { Language, LANGUAGES } from '../types';
import { withRetry } from '../utils';
import { getGeminiKey } from '../lib/gemini';

interface Expression {
  phrase: string;
  meaning: string;
  example: string;
}

interface CultureData {
  history: { title: string; text: string };
  etiquette: { title: string; text: string };
  expressions: Expression[];
}

export const CultureHub: React.FC<{ language: Language; onAction?: () => void; apiKey?: string }> = ({ 
  language, onAction, apiKey 
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [cultureData, setCultureData] = useState<CultureData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetTranslationLang, setTargetTranslationLang] = useState('Português Brasil');
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [isTranslating, setIsTranslating] = useState(false);

  const fetchCultureData = async (searchQuery?: string) => {
    setIsLoading(true);
    setError(null);
    setTranslations({});
    if (onAction) onAction();

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey || getGeminiKey() || '', apiVersion: 'v1' });
      const promptText = searchQuery
        ? `Guia cultural: tema "${searchQuery}" em países de língua ${language}.`
        : `Resumo cultural: curiosidades e costumes em países de língua ${language}.`;

      const response = await withRetry<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{
          parts: [{
            text: `${promptText} 
            REGRAS OBRIGATÓRIAS:
            1. Retorne APENAS um objeto JSON puro.
            2. Responda em PORTUGUÊS.
            3. Formato: { "history": {"title": "...", "text": "..."}, "etiquette": {"title": "...", "text": "..."}, "expressions": [{"phrase": "...", "meaning": "...", "example": "..."}] }`
          }]
        }]
      }));

      const text = response.text || '';
      let jsonStr = text;
      if (text.includes('```json')) jsonStr = text.split('```json')[1].split('```')[0].trim();
      else if (text.includes('```')) jsonStr = text.split('```')[1].split('```')[0].trim();
      
      const parsed = JSON.parse(jsonStr.trim());
      if (parsed.history && parsed.etiquette) setCultureData(parsed);
      else throw new Error("Incompleto");

    } catch (e) {
      console.error(e);
      setError("Erro ao carregar dados culturais.");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-white tracking-tighter">Cultura & Viagem</h2>
        <p className="text-slate-400">Descubra costumes e curiosidades de países que falam {language}.</p>
      </div>

      <div className="relative group">
        <input 
          type="text" value={query} onChange={(e) => setQuery(e.target.value)} 
          placeholder="Ex: gastronomia, feriados, história..." 
          className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-3xl px-8 py-6 text-white text-lg focus:border-indigo-500/50 transition-all"
        />
        <button 
          onClick={() => fetchCultureData(query)} 
          disabled={isLoading}
          className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl active:scale-95"
        >
          {isLoading ? 'Explorando...' : 'Explorar'}
        </button>
      </div>

      {isLoading && <div className="text-center py-20 text-slate-500">Buscando informações culturais...</div>}

      {cultureData && !isLoading && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-4">
            <h3 className="text-indigo-400 text-xs font-black uppercase tracking-widest">{cultureData.history.title}</h3>
            <p className="text-white leading-relaxed">{cultureData.history.text}</p>
          </div>
          <div className="glass-panel p-8 rounded-3xl border-white/5 space-y-4">
            <h3 className="text-emerald-400 text-xs font-black uppercase tracking-widest">{cultureData.etiquette.title}</h3>
            <p className="text-white leading-relaxed">{cultureData.etiquette.text}</p>
          </div>
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-white text-xl font-bold">Expressões Úteis</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {cultureData.expressions.map((exp, idx) => (
                <div key={idx} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                  <div className="text-indigo-400 font-bold mb-2">{exp.phrase}</div>
                  <div className="text-slate-400 text-sm mb-2 italic">"{exp.meaning}"</div>
                  <div className="text-slate-500 text-xs uppercase font-black">Exemplo:</div>
                  <div className="text-slate-300 text-sm">{exp.example}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && <div className="text-center py-20 text-red-400 font-bold">{error}</div>}
    </div>
  );
};
