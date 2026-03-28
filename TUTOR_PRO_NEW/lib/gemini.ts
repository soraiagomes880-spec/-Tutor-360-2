export const getGeminiKey = (): string | null => {
    // Priority 1: Setup Modal (localStorage)
    if (typeof window !== 'undefined') {
        const localKey = localStorage.getItem('gemini_api_key') || localStorage.getItem('GEMINI_API_KEY');
        if (localKey && localKey !== 'undefined' && localKey !== '') return localKey;
    }

    // Priority 2: Environment Variables
    const env = (import.meta as any).env || {};
    const processEnv = (typeof process !== 'undefined' ? process.env : {}) as any;

    const envKey = env.VITE_API_KEY || processEnv.VITE_API_KEY || processEnv.API_KEY || processEnv.GEMINI_API_KEY;
    if (envKey && envKey !== 'undefined' && envKey !== '') return envKey;

    return null;
};

export const saveGeminiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    localStorage.setItem('GEMINI_API_KEY', key);
};
