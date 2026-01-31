
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LiveChat } from './components/LiveChat';
import { PronunciationLab } from './components/PronunciationLab';
import { GrammarLab } from './components/GrammarLab';
import { VisualScan } from './components/VisualScan';
import { CultureHub } from './components/CultureHub';
import { Tutorial } from './components/Tutorial';
import { UsageLimitModal } from './components/UsageLimitModal';
import { AppTab, Language, LANGUAGES } from './types';

interface UserStats {
  lessons: number;
  hours: number;
  days: number;
  usage: number;
  lastActiveDate: string | null;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [language, setLanguage] = useState<Language>('Inglês');
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Stats State - Zerado conforme solicitado
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('tutor360_stats');
    if (saved) return JSON.parse(saved);
    return { lessons: 0, hours: 0, days: 0, usage: 0, lastActiveDate: null };
  });

  useEffect(() => {
    localStorage.setItem('tutor360_stats', JSON.stringify(stats));
  }, [stats]);

  // Função para verificar e incrementar a ofensiva apenas quando houver atividade real
  const checkStreak = (currentStats: UserStats): UserStats => {
    const today = new Date().toDateString();
    if (currentStats.lastActiveDate !== today) {
      return {
        ...currentStats,
        days: currentStats.days + 1,
        lastActiveDate: today
      };
    }
    return currentStats;
  };

  const incrementUsage = () => {
    setStats(prev => {
      const updated = checkStreak(prev);
      return { ...updated, usage: Math.min(updated.usage + 1, 15) };
    });
  };

  const addLesson = (durationMinutes: number) => {
    setStats(prev => {
      const updated = checkStreak(prev);
      return {
        ...updated,
        lessons: updated.lessons + 1,
        hours: Number((updated.hours + durationMinutes / 60).toFixed(1)),
        usage: Math.min(updated.usage + 1, 15)
      };
    });
  };

  // Exit Intent Logic
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Show modal if mouse leaves the window at the top (intent to close/switch tab)
      if (e.clientY <= 0) {
        setShowExitModal(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const currentLang = LANGUAGES.find(l => l.name === language) || LANGUAGES[0];

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: 'fa-house' },
    { id: 'live', label: 'Voz', icon: 'fa-microphone-lines' },
    { id: 'pronunciation', label: 'Fala', icon: 'fa-volume-high' },
    { id: 'writing', label: 'Escrita', icon: 'fa-pen-nib' },
    { id: 'scan', label: 'Visão', icon: 'fa-eye' },
    { id: 'culture', label: 'Cultura', icon: 'fa-earth-americas' },
    { id: 'tutorial', label: 'Ajuda', icon: 'fa-circle-question' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} usage={stats.usage} />
      </div>

      <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0">
        <header className="sticky top-0 z-20 glass-panel border-b border-white/10 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fas fa-graduation-cap text-white text-base md:text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white leading-none">
                Tutor 360 <span className="text-indigo-400">IA</span>
              </h1>
              <span className="hidden md:inline text-[10px] uppercase tracking-widest text-slate-500 font-bold">Premium Learning</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 md:gap-3 bg-white/5 border border-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-xl hover:bg-white/10 transition-all group"
              >
                <span className="text-lg md:text-xl">{currentLang.flag}</span>
                <span className="text-xs md:text-sm font-medium text-slate-300 group-hover:text-white">{currentLang.name}</span>
                <i className={`fas fa-chevron-down text-[8px] md:text-[10px] text-slate-500 transition-transform ${showLangMenu ? 'rotate-180' : ''}`}></i>
              </button>

              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 glass-panel rounded-2xl border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Escolha o Idioma</p>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.name}
                      onClick={() => {
                        setLanguage(lang.name);
                        setShowLangMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${language === lang.name ? 'text-indigo-400 bg-indigo-500/5' : 'text-slate-300'}`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto h-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              language={language}
              onStart={() => setActiveTab('live')}
              stats={stats}
            />
          )}
          {activeTab === 'live' && <LiveChat language={language} onSessionEnd={addLesson} />}
          {activeTab === 'pronunciation' && <PronunciationLab language={language} onAction={incrementUsage} />}
          {activeTab === 'writing' && <GrammarLab language={language} onAction={incrementUsage} />}
          {activeTab === 'scan' && <VisualScan language={language} onAction={incrementUsage} />}
          {activeTab === 'culture' && <CultureHub language={language} onAction={incrementUsage} />}
          {activeTab === 'tutorial' && <Tutorial />}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 flex items-center justify-around py-3 px-2 z-50">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as AppTab)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-indigo-400 scale-110' : 'text-slate-500'
              }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Usage Limit Modal */}
      {stats.usage >= 15 && (
        <UsageLimitModal partnerLink="https://api.whatsapp.com/send?phone=5511914146879&text=Quero%20testar" />
      )}

      {/* Exit Intent Modal - Only if not blocked by usage limit */}
      {showExitModal && stats.usage < 15 && (
        <UsageLimitModal
          title="Espere! Não vá ainda!"
          description="Você ainda tem acesso gratuito ao Tutor 360 IA. Queremos te oferecer uma condição especial para se tornar parceiro."
          partnerLink="https://api.whatsapp.com/send?phone=5511914146879&text=Quero%20testar"
          onClose={() => setShowExitModal(false)}
        />
      )}
    </div>
  );
};

export default App;
