import React from 'react';
import { Language } from '../types';

export const Tutorial: React.FC = () => {
  const features = [
    {
      icon: 'fa-microphone-lines',
      color: 'indigo',
      title: 'Chat ao Vivo',
      desc: 'Converse naturalmente com um Tutor IA nativo. Ele corrige seus erros e mantém o diálogo fluindo.',
    },
    {
      icon: 'fa-volume-high',
      color: 'pink',
      title: 'Laboratório de Pronúncia',
      desc: 'Treine frases específicas. A IA analisa seu áudio e dá feedback detalhado sobre cada fonema.',
    },
    {
      icon: 'fa-pen-nib',
      color: 'emerald',
      title: 'Correção de Escrita',
      desc: 'Escreva textos e receba correções gramaticais instantâneas com explicações do porquê.',
    },
    {
      icon: 'fa-eye',
      color: 'amber',
      title: 'Varredura Visual',
      desc: 'Aponte a câmera (ou upload) para objetos e aprenda como falar o nome deles no idioma escolhido.',
    },
  ];

  const faqs = [
    {
      q: "Como funciona a ofensiva (dias seguidos)?",
      a: "Para manter sua ofensiva, você precisa completar pelo menos uma lição ou interação (chat, pronúncia, etc.) por dia. Se pular um dia, o contador zera!"
    },
    {
      q: "Preciso pagar para usar?",
      a: "Sim. Cada interação (chat, correção ou análise) consome créditos do seu plano. Acompanhe seu uso no menu lateral."
    },
    {
      q: "Posso mudar o idioma a qualquer momento?",
      a: "Sim! Use o menu no topo direito para alternar entre Inglês, Espanhol, Francês e outros idiomas sem perder seu progresso geral."
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-12">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-indigo-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
          <i className="fas fa-book-open text-3xl text-indigo-400"></i>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Central de Ajuda</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Domine todas as ferramentas do <span className="text-indigo-400 font-bold">Tutor 360 IA</span> e acelere sua fluência.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {features.map((feature, idx) => (
          <div key={idx} className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 hover:bg-white/5 transition-all text-left group">
            <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 border border-${feature.color}-500/20 group-hover:scale-110 transition-transform`}>
              <i className={`fas ${feature.icon} text-2xl text-${feature.color}-400`}></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] border-white/10 relative overflow-hidden bg-slate-900/50">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <i className="fas fa-question text-[150px] -rotate-12"></i>
        </div>

        <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
          <i className="fas fa-circle-question text-indigo-400"></i>
          Perguntas Frequentes
        </h3>

        <div className="grid gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-black/20 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
              <h4 className="font-bold text-white text-base md:text-lg mb-3">{faq.q}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-slate-600 font-medium">Versão 1.2.0 • Powered by Google Gemini</p>
      </div>
    </div>
  );
};
