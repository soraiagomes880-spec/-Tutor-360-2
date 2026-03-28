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

// Setup Modal Component
const SetupModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(getGeminiKey() || '');
  const [supaUrl, setSupaUrl] = useState(localStorage.getItem('supabase_url') || '');
  const [supaKey, setSupaKey] = useState(localStorage.getItem('supabase_key') || '');
  const [activeTab, setActiveTab] = useState<'api' | 'supabase'>('api');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel p-8 rounded-[2.5rem] border-white/10 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white">
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-cog text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Control</h2>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl mb-6">
          <button onClick={() => setActiveTab('api')} className={`flex-1 py-2 rounded-lg ${activeTab === 'api' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Gemini AI</button>
          <button onClick={() => setActiveTab('supabase')} className={`flex-1 py-2 rounded-lg ${activeTab === 'supabase' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Supabase</button>
        </div>

        <div className="space-y-4 mb-8">
          {activeTab === 'api' ? (
            <div className="space-y-4">
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Google Gemini Key" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" />
              <button onClick={() => { saveGeminiKey(apiKey); window.location.reload(); }} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase">Save AI Key</button>
            </div>
          ) : (
            <div className="space-y-4">
              <input type="text" value={supaUrl} onChange={(e) => setSupaUrl(e.target.value)} placeholder="Supabase URL" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" />
              <input type="password" value={supaKey} onChange={(e) => setSupaKey(e.target.value)} placeholder="Supabase Anon Key" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs" />
              <button onClick={() => saveSupabaseConfig(supaUrl, supaKey)} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase">Save Database</button>
            </div>
          )}
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

  const usageLimit = 80; // Fixed PRO limit

  useEffect(() => {
    if (!supabase) {
      setIsLoadingData(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      if (supabase && session?.user) {
        try {
          const { data, error } = await supabase.from('profiles').select('usage_count').eq('id', session.user.id).single();
          if (data) setUsageCount(data.usage_count || 0);
          else if (error?.code === 'PGRST116') {
            await supabase.from('profiles').insert([{ id: session.user.id, usage_count: 0, plan_level: 'Pro' }]);
          }
        } catch (e) { console.error(e); }
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
      await supabase.from('profiles').update({ usage_count: nextCount }).eq('id', session.user.id);
    }
  };

  if (supabase && !session) return <Auth />;
  if (isLoadingData) return <div className="h-screen bg-slate-950 flex items-center justify-center text-white">Loading Pro Environment...</div>;

  const currentLang = LANGUAGES.find(l => l.name === language) || LANGUAGES[0];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden relative font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} usage={usageCount} limit={usageLimit} planName={plan} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <header className="sticky top-0 z-20 glass-panel border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSetupClickCount(prev => (prev + 1 >= 5 ? (setShowSetup(true), 0) : prev + 1)); }}>
            <button onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }} className="lg:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg border border-white/10"><i className="fas fa-bars"></i></button>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg"><i className="fas fa-graduation-cap text-white text-xl"></i></div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white leading-none tracking-tight">Tutor 360</h1>
              <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/10 font-bold uppercase mt-1 inline-block">{plan}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-lg">{currentLang.flag}</button>
            {showLangMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 glass-panel rounded-2xl border border-white/10 py-2 z-50">
                {LANGUAGES.map((lang) => (<button key={lang.name} onClick={() => { setLanguage(lang.name); setShowLangMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5"><span className="text-xl">{lang.flag}</span><span className="text-sm">{lang.name}</span></button>))}
              </div>
            )}
            <button onClick={async () => { if (supabase) await supabase.auth.signOut(); }} className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-red-400"><i className="fas fa-right-from-bracket"></i></button>
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
