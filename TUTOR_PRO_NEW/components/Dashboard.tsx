
import React from 'react';
import { Language, AppTab } from '../types';

interface DashboardProps {
  language: Language;
  setActiveTab: (tab: AppTab) => void;
  usage: number;
  limit: number;
  planName?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ language, setActiveTab, usage, limit, planName }) => {
  const usagePercentage = Math.round((usage / limit) * 100);
  const strokeDashoffset = 502 - (502 * usagePercentage) / 100;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Praticar {language}</h2>
          <p className="text-slate-400 text-base md:text-lg">Foco de hoje: <span className="text-indigo-400 font-semibold">Conversação Fluida (PRO)</span></p>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
          <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">Plano Pro Ativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-[2rem] border-white/5 bg-slate-900/40 text-center">
          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 text-green-400"><i className="fas fa-check"></i></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">AÇÕES REALIZADAS</p>
          <span className="text-2xl font-black text-white">{usage}</span>
        </div>
        <div className="glass-panel p-6 rounded-[2rem] border-white/5 bg-slate-900/40 text-center">
          <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 text-indigo-400"><i className="fas fa-bolt"></i></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">LIMITE PRO</p>
          <span className="text-2xl font-black text-white">{limit}</span>
        </div>
        <div className="glass-panel p-6 rounded-[2rem] border-white/5 bg-slate-900/40 text-center">
          <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 text-amber-500"><i className="fas fa-medal"></i></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">VANTAGEM</p>
          <span className="text-xl font-black text-white">Vozes HD</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden bg-[#1e293b]/30">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full border-8 border-indigo-500/10 flex items-center justify-center relative shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-indigo-500" strokeDasharray="502" strokeDashoffset={strokeDashoffset} style={{ r: '38%' }} />
              </svg>
              <div className="text-center">
                <span className="text-2xl font-black text-white">{usagePercentage}%</span>
                <p className="text-[8px] text-slate-400 uppercase font-bold">Uso</p>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Seu Progresso PRO</h3>
              <p className="text-slate-400 text-xs mb-4 italic">Aproveite as vozes premium liberadas!</p>
              <button onClick={() => setActiveTab('live')} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-indigo-900/40">Praticar Agora</button>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 bg-slate-900/40 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <i className="fas fa-lock text-slate-500 text-xs"></i>
            RECURSOS RESERVADOS (ELITE)
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 opacity-60">
              <div className="flex items-center gap-3">
                <i className="fas fa-lock text-[10px] text-slate-500"></i>
                <span className="text-xs text-slate-300">Busca em Tempo Real (Google Search)</span>
              </div>
              <span className="text-[8px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20 font-black">ELITE</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 opacity-60">
              <div className="flex items-center gap-3">
                <i className="fas fa-lock text-[10px] text-slate-500"></i>
                <span className="text-xs text-slate-300">Modo Business & Notícias de Hoje</span>
              </div>
              <span className="text-[8px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20 font-black">ELITE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
