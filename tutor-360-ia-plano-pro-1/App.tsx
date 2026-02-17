
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LiveChat } from './components/LiveChat';
import { PronunciationLab } from './components/PronunciationLab';
import { GrammarLab } from './components/GrammarLab';
import { VisualScan } from './components/VisualScan';
import { CultureHub } from './components/CultureHub';
import { Tutorial } from './components/Tutorial';
import { Auth } from './components/Auth';
import { AppTab, Language, LANGUAGES } from './types';
import { supabase, saveSupabaseConfig } from './lib/supabase';
import { getGeminiKey, saveGeminiKey } from './lib/gemini';

const SetupModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(getGeminiKey() || '');
  const [supaUrl, setSupaUrl] = useState(localStorage.getItem('supabase_url') || '');
  const [supaKey, setSupaKey] = useState(localStorage.getItem('supabase_key') || '');
  const [activeTab, setActiveTab] = useState<'api' | 'supabase'>('api');

  if (!isOpen) return null;

  const currentGemini = getGeminiKey();
  const currentSupa = localStorage.getItem('supabase_url');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg glass-panel p-8 rounded-[2.5rem] border-white/10 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-900/40">
            <i className="fas fa-cog text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Configurações Avançadas</h2>
          <p className="text-slate-400 text-xs mt-1 lowercase">Ambiente de Controle do Administrador</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl mb-6">
          <button onClick={() => setActiveTab('api')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'api' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Gemini AI</button>
          <button onClick={() => setActiveTab('supabase')} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'supabase' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Supabase</button>
        </div>

        <div className="space-y-4 mb-8">
          {activeTab === 'api' ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Google Gemini API Key</label>
                  {currentGemini && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-black uppercase">Ativo</span>}
                </div>
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AIzaSy..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-700 outline-none focus:border-indigo-500/50 transition-all font-mono text-xs" />
              </div>
              <button
                onClick={() => { saveGeminiKey(apiKey); window.location.reload(); }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/40 active:scale-95 text-xs uppercase"
              >
                Salvar Chave IA
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Supabase Project URL</label>
                  {currentSupa && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-black uppercase">Ativo</span>}
                </div>
                <input type="text" value={supaUrl} onChange={(e) => setSupaUrl(e.target.value)} placeholder="https://xxx.supabase.co" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-700 outline-none focus:border-indigo-500/50 transition-all font-mono text-xs" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Supabase Anon Key</label>
                <input type="password" value={supaKey} onChange={(e) => setSupaKey(e.target.value)} placeholder="eyJhbGci..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-700 outline-none focus:border-indigo-500/50 transition-all font-mono text-xs" />
              </div>
              <button
                onClick={() => saveSupabaseConfig(supaUrl, supaKey)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/40 active:scale-95 text-xs uppercase"
              >
                Salvar Banco de Dados
              </button>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-white/5 text-center">
          <p className="text-[9px] text-slate-600 leading-relaxed max-w-xs mx-auto italic uppercase tracking-wider font-medium">As chaves são salvas localmente e priorizam as variáveis de ambiente da Vercel.</p>
        </div>
      </div>
    </div>
  );
};

export type PlanLevel = 'Essencial' | 'Pro' | 'Elite';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [language, setLanguage] = useState<Language>('Inglês');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [plan, setPlan] = useState<PlanLevel>('Pro');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [setupClickCount, setSetupClickCount] = useState(0);

  const planLimits: Record<PlanLevel, number> = {
    'Essencial': 50,
    'Pro': 80,
    'Elite': 100
  };

  const usageLimit = planLimits[plan];

  useEffect(() => {
    if (!supabase) {
      setIsLoadingData(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const handleOpenSetup = () => setShowSetup(true);
    window.addEventListener('open-setup', handleOpenSetup);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('open-setup', handleOpenSetup);
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);

      if (supabase && session?.user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('usage_count, plan_level')
            .eq('id', session.user.id)
            .single();

          if (data) {
            setUsageCount(data.usage_count || 0);
            // Priorizamos Pro para este deploy específico
            setPlan('Pro');
          } else if (error && error.code === 'PGRST116') {
            await supabase.from('profiles').insert([
              { id: session.user.id, usage_count: 0, plan_level: 'Pro' }
            ]);
            setUsageCount(0);
            setPlan('Pro');
          }
        } catch (e) {
          console.error("Erro na sincronização:", e);
        }
      } else {
        const localUsage = localStorage.getItem('tutor_usage');
        setUsageCount(localUsage ? parseInt(localUsage) : 0);
      }

      setIsLoadingData(false);
    };

    loadData();
  }, [session]);

  const trackUsage = async () => {
    const nextCount = usageCount + 1;
    if (nextCount > usageLimit) return;

    setUsageCount(nextCount);

    if (supabase && session?.user) {
      await supabase
        .from('profiles')
        .update({ usage_count: nextCount })
        .eq('id', session.user.id);
    } else {
      localStorage.setItem('tutor_usage', nextCount.toString());
    }
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    else {
      setSession(null);
      setUsageCount(0);
    }
  };

  if (supabase && !session) {
    return <Auth />;
  }

  if (isLoadingData) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">Preparando Ambiente PRO...</p>
        </div>
      </div>
    );
  }

  const currentLang = LANGUAGES.find(l => l.name === language) || LANGUAGES[0];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden relative">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
        usage={usageCount}
        limit={usageLimit}
        planName={plan}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <header className="sticky top-0 z-20 glass-panel border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg border border-white/10"
            >
              <i className="fas fa-bars text-white"></i>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
            </div>
            <div
              className="cursor-pointer select-none"
              onClick={() => {
                setSetupClickCount(prev => {
                  if (prev + 1 >= 5) {
                    setShowSetup(true);
                    return 0;
                  }
                  return prev + 1;
                });
              }}
            >
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white leading-none">Tutor 360</h1>
              <span className="text-[8px] md:text-[9px] bg-indigo-500/10 text-indigo-400/70 px-1.5 py-0.5 rounded border border-indigo-500/10 font-black uppercase mt-1 inline-block tracking-widest">{plan}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl hover:bg-white/10 transition-all">
                <span className="text-lg">{currentLang.flag}</span>
                <i className={`fas fa-chevron-down text-[10px] text-slate-500 transition-transform ${showLangMenu ? 'rotate-180' : ''}`}></i>
              </button>
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 glass-panel rounded-2xl border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {LANGUAGES.map((lang) => (
                    <button key={lang.name} onClick={() => { setLanguage(lang.name); setShowLangMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-slate-300 transition-colors">
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-95"
              title="Sair"
            >
              <i className="fas fa-right-from-bracket"></i>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
          {activeTab === 'dashboard' && <Dashboard language={language} setActiveTab={setActiveTab} usage={usageCount} limit={usageLimit} planName={plan} />}
          {activeTab === 'live' && <LiveChat language={language} onAction={trackUsage} />}
          {activeTab === 'pronunciation' && <PronunciationLab language={language} onAction={trackUsage} />}
          {activeTab === 'writing' && <GrammarLab language={language} onAction={trackUsage} />}
          {activeTab === 'scan' && <VisualScan language={language} onAction={trackUsage} />}
          {activeTab === 'culture' && <CultureHub language={language} onAction={trackUsage} />}
          {activeTab === 'tutorial' && <Tutorial setActiveTab={setActiveTab} />}
        </div>
        <SetupModal isOpen={showSetup} onClose={() => setShowSetup(false)} />
      </main>
    </div>
  );
};

export default App;
