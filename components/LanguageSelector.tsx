import React from 'react';
import { useLanguage, Language } from '../i18n';

interface Props {
  variant?: 'login' | 'sidebar';
}

export const LanguageSelector: React.FC<Props> = ({ variant = 'sidebar' }) => {
  const { language, setLanguage } = useLanguage();

  const langs: { code: Language; label: string }[] = [
    { code: 'es', label: 'ES' },
    { code: 'fr', label: 'FR' },
    { code: 'de', label: 'DE' }
  ];

  return (
    <div className={`flex gap-1 ${variant === 'login' ? 'justify-center' : 'justify-start px-6 pb-4'}`}>
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          className={`
            text-[10px] font-bold font-mono px-2 py-1 border transition-all
            ${language === l.code 
              ? 'bg-avispa-accent text-black border-avispa-accent' 
              : 'bg-transparent text-slate-500 border-slate-700 hover:text-white hover:border-slate-500'}
          `}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};