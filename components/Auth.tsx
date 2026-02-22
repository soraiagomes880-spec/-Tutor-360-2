
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Auth: React.FC<{ onLogoClick?: () => void }> = ({ onLogoClick }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (!supabase) {
            setError('Atenção: Sistema não conectado. Clique 5 vezes no ícone do chapéu (topo) para configurar URL e Chave do Supabase.');
            setLoading(false);
            return;
        }

        try {
            if (mode === 'signup') {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: window.location.origin
                    }
                });

                if (error) throw error;

                if (data.user && data.session) {
                    setMessage('Cadastro realizado com sucesso! Você já pode entrar.');
                } else {
                    setMessage('Cadastro iniciado! Verifique sua caixa de entrada para confirmar o e-mail e ativar sua conta.');
                }
            } else if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else if (mode === 'reset') {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin
                });
                if (error) throw error;
                setMessage('Link de recuperação enviado para seu e-mail!');
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro na autenticação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] p-6">
            <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
                <div className="glass-panel p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500"></div>

                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-900/40 transform -rotate-6">
                            <i className="fas fa-graduation-cap text-white text-3xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Tutor 360 <span className="text-indigo-400">2</span></h1>
                        <p className="text-slate-400 text-sm">
                            {mode === 'login' && 'Acesse seu painel de estudos'}
                            {mode === 'signup' && 'Crie sua conta de aluno'}
                            {mode === 'reset' && 'Recuperar sua senha'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">E-mail Institucional</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all"
                                placeholder="seu@email.com"
                            />
                        </div>

                        {mode !== 'reset' && (
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Senha de Acesso</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] p-4 rounded-xl text-center font-medium animate-pulse">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] p-4 rounded-xl text-center font-medium italic">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-3"
                        >
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className={`fas ${mode === 'signup' ? 'fa-user-plus' : (mode === 'reset' ? 'fa-envelope-open-text' : 'fa-right-to-bracket')}`}></i>}
                            {mode === 'login' && 'Entrar na Plataforma'}
                            {mode === 'signup' && 'Criar Conta Grátis'}
                            {mode === 'reset' && 'Enviar Link de Recuperação'}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col gap-4 text-center">
                        {mode === 'login' ? (
                            <>
                                <button onClick={() => setMode('signup')} className="text-[11px] font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors" type="button">Ainda não tem acesso? Cadastre-se</button>
                                <button onClick={() => setMode('reset')} className="text-[11px] font-bold text-indigo-400/60 hover:text-indigo-400 uppercase tracking-widest transition-colors" type="button">Esqueceu a senha?</button>
                            </>
                        ) : (
                            <button onClick={() => setMode('login')} className="text-[11px] font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-widest transition-colors" type="button">Voltar para o Login</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
