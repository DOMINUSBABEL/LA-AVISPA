import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'es' | 'fr' | 'de' | 'en';

export const translations = {
  es: {
    login: {
        operator: '// Operador ID',
        key: '// Clave de Acceso',
        btn: 'Inicializar Sistema',
        access_denied: 'ACCESO DENEGADO: CREDENCIALES INVÁLIDAS',
        dev_by: 'Desarrollado por Consultora Talleyrand © 2025',
        secure: 'CONEXIÓN SEGURA ESTABLECIDA'
    },
    sidebar: {
        cmd: 'MARKET COMMAND',
        grid: 'GROWTH GRID',
        cp: 'CRONO_POSTING',
        system: 'SISTEMA: EN LÍNEA'
    },
    cmd: {
        title: 'MARKET_COMMAND',
        subtitle: 'SECUENCIA ACTIVA SIEE',
        placeholder: 'INGRESAR OBJETIVO ESTRATÉGICO...',
        exec: 'EJECUTAR',
        running: 'EJECUTANDO',
        processing: 'PROCESANDO...',
        init_seq: 'INICIALIZANDO SECUENCIA...',
        sources: 'FUENTES DE INTELIGENCIA:',
        awaiting: 'Esperando Directivas. Ingrese un producto u objetivo de mercado.',
        agent_market: 'B2 - Inteligencia',
        agent_strat: 'B3 - Estratega',
        agent_creative: 'B4 - Creativo',
        agent_guardian: 'B5 - Guardián'
    },
    grid: {
        title: 'GROWTH_GRID',
        generate: 'GENERAR MATRIZ',
        calculating: 'CALCULANDO...',
        placeholder: 'Nombre del Producto...',
        headers: 'PERSONA \\ USP',
        details: 'COORDENADAS',
        hook: 'GANCHO / TITULAR',
        pain: 'PUNTO DE DOLOR',
        solution: 'PITCH DE SOLUCIÓN',
        channel: 'CANAL RECOMENDADO',
        empty: 'Seleccione una celda de la matriz para revelar la carga viral.'
    },
    camp: {
        title: 'GENERADOR DE CRONOPOSTING',
        subtitle: 'Configuración Avanzada',
        magic_prompt: 'Autoconfiguración Táctica (Magic Prompt)',
        magic_placeholder: 'Describe tu objetivo y la IA ajustará todos los parámetros...',
        generate: 'GENERAR ESTRATEGIA',
        processing: 'PROCESANDO ESTRATEGIA...',
        params_time: 'Parámetros Temporales',
        params_strat: 'Estrategia de Contenido',
        params_res: 'Canales y Recursos',
        duration: 'DURACIÓN',
        start_date: 'FECHA DE INICIO',
        frequency: 'FRECUENCIA',
        tone: 'TONO',
        mix: 'MIX DE CONTENIDO',
        kpi: 'KPI PRINCIPAL',
        res_level: 'NIVEL DE RECURSOS',
        platforms: 'PLATAFORMAS ACTIVAS',
        formats: 'FORMATOS CLAVE',
        obj_y: 'OBJETIVO ESTRATÉGICO (Y)',
        active_plan: 'Plan Activo',
        production: 'Instrucciones de Producción',
        no_plan: 'NO HAY ESTRATEGIA GENERADA'
    }
  },
  en: {
    login: {
        operator: '// Operator ID',
        key: '// Access Key',
        btn: 'Initialize System',
        access_denied: 'ACCESS DENIED: INVALID CREDENTIALS',
        dev_by: 'Developed by Consultora Talleyrand © 2025',
        secure: 'SECURE CONNECTION ESTABLISHED'
    },
    sidebar: {
        cmd: 'MARKET COMMAND',
        grid: 'GROWTH GRID',
        cp: 'CRONO_POSTING',
        system: 'SYSTEM: ONLINE'
    },
    cmd: {
        title: 'MARKET_COMMAND',
        subtitle: 'SIEE ACTIVE SEQUENCE',
        placeholder: 'ENTER STRATEGIC OBJECTIVE...',
        exec: 'EXECUTE',
        running: 'RUNNING',
        processing: 'PROCESSING...',
        init_seq: 'INITIALIZING SEQUENCE...',
        sources: 'INTELLIGENCE SOURCES:',
        awaiting: 'Awaiting Directives. Enter a product or market objective.',
        agent_market: 'B2 - Intelligence',
        agent_strat: 'B3 - Strategist',
        agent_creative: 'B4 - Creative',
        agent_guardian: 'B5 - Guardian'
    },
    grid: {
        title: 'GROWTH_GRID',
        generate: 'GENERATE MATRIX',
        calculating: 'CALCULATING...',
        placeholder: 'Product Name...',
        headers: 'PERSONA \\ USP',
        details: 'COORDINATES',
        hook: 'HOOK / HEADLINE',
        pain: 'PAIN POINT',
        solution: 'SOLUTION PITCH',
        channel: 'RECOMMENDED CHANNEL',
        empty: 'Select a matrix cell to reveal viral payload.'
    },
    camp: {
        title: 'CRONOPOSTING GENERATOR',
        subtitle: 'Advanced Configuration',
        magic_prompt: 'Tactical Autoconfiguration (Magic Prompt)',
        magic_placeholder: 'Describe your objective and AI will adjust all parameters...',
        generate: 'GENERATE STRATEGY',
        processing: 'PROCESSING STRATEGY...',
        params_time: 'Temporal Parameters',
        params_strat: 'Content Strategy',
        params_res: 'Channels & Resources',
        duration: 'DURATION',
        start_date: 'START DATE',
        frequency: 'FREQUENCY',
        tone: 'TONE',
        mix: 'CONTENT MIX',
        kpi: 'MAIN KPI',
        res_level: 'RESOURCE LEVEL',
        platforms: 'ACTIVE PLATFORMS',
        formats: 'KEY FORMATS',
        obj_y: 'STRATEGIC OBJECTIVE (Y)',
        active_plan: 'Active Plan',
        production: 'Production Instructions',
        no_plan: 'NO STRATEGY GENERATED'
    }
  },
  fr: {
    login: {
        operator: '// ID Opérateur',
        key: '// Clé d\'Accès',
        btn: 'Initialiser le Système',
        access_denied: 'ACCÈS REFUSÉ : IDENTIFIANTS INVALIDES',
        dev_by: 'Développé par Consultora Talleyrand © 2025',
        secure: 'CONNEXION SÉCURISÉE ÉTABLIE'
    },
    sidebar: {
        cmd: 'MARKET COMMAND',
        grid: 'GROWTH GRID',
        cp: 'CHRONO_POSTING',
        system: 'SYSTÈME : EN LIGNE'
    },
    cmd: {
        title: 'MARKET_COMMAND',
        subtitle: 'SÉQUENCE ACTIVE SIEE',
        placeholder: 'ENTRER OBJECTIF STRATÉGIQUE...',
        exec: 'EXÉCUTER',
        running: 'EN COURS',
        processing: 'TRAITEMENT...',
        init_seq: 'INITIALISATION DE LA SÉQUENCE...',
        sources: 'SOURCES DE RENSEIGNEMENT :',
        awaiting: 'En attente de directives. Entrez un produit ou un objectif de marché.',
        agent_market: 'B2 - Renseignement',
        agent_strat: 'B3 - Stratège',
        agent_creative: 'B4 - Créatif',
        agent_guardian: 'B5 - Gardien'
    },
    grid: {
        title: 'GROWTH_GRID',
        generate: 'GÉNÉRER MATRICE',
        calculating: 'CALCUL...',
        placeholder: 'Nom du Produit...',
        headers: 'PERSONA \\ USP',
        details: 'COORDONNÉES',
        hook: 'ACCROCHE / TITRE',
        pain: 'POINT DE DOULEUR',
        solution: 'PITCH DE SOLUTION',
        channel: 'CANAL RECOMMANDÉ',
        empty: 'Sélectionnez une cellule pour révéler la charge virale.'
    },
    camp: {
        title: 'GÉNÉRATEUR DE CHRONOPOSTING',
        subtitle: 'Configuration Avancée',
        magic_prompt: 'Autoconfiguration Tactique (Magic Prompt)',
        magic_placeholder: 'Décrivez votre objectif et l\'IA ajustera les paramètres...',
        generate: 'GÉNÉRER STRATÉGIE',
        processing: 'TRAITEMENT...',
        params_time: 'Paramètres Temporels',
        params_strat: 'Stratégie de Contenu',
        params_res: 'Canaux et Ressources',
        duration: 'DURÉE',
        start_date: 'DATE DE DÉBUT',
        frequency: 'FRÉQUENCE',
        tone: 'TON',
        mix: 'MIX DE CONTENU',
        kpi: 'KPI PRINCIPAL',
        res_level: 'NIVEAU DE RESSOURCES',
        platforms: 'PLATEFORMES ACTIVES',
        formats: 'FORMATS CLÉS',
        obj_y: 'OBJECTIF STRATÉGIQUE (Y)',
        active_plan: 'Plan Actif',
        production: 'Instructions de Production',
        no_plan: 'AUCUNE STRATÉGIE GÉNÉRÉE'
    }
  },
  de: {
    login: {
        operator: '// Bediener-ID',
        key: '// Zugangsschlüssel',
        btn: 'System Initialisieren',
        access_denied: 'ZUGRIFF VERWEIGERT: UNGÜLTIGE DATEN',
        dev_by: 'Entwickelt von Consultora Talleyrand © 2025',
        secure: 'SICHERE VERBINDUNG HERGESTELLT'
    },
    sidebar: {
        cmd: 'MARKET COMMAND',
        grid: 'GROWTH GRID',
        cp: 'CHRONO_POSTING',
        system: 'SYSTEM: ONLINE'
    },
    cmd: {
        title: 'MARKET_COMMAND',
        subtitle: 'AKTIVE SIEE-SEQUENZ',
        placeholder: 'STRATEGISCHES ZIEL EINGEBEN...',
        exec: 'AUSFÜHREN',
        running: 'LÄUFT',
        processing: 'VERARBEITUNG...',
        init_seq: 'SEQUENZ INITIALISIEREN...',
        sources: 'NACHRICHTENQUELLEN:',
        awaiting: 'Warte auf Anweisungen. Geben Sie ein Produkt oder Marktziel ein.',
        agent_market: 'B2 - Aufklärung',
        agent_strat: 'B3 - Stratege',
        agent_creative: 'B4 - Kreativ',
        agent_guardian: 'B5 - Wächter'
    },
    grid: {
        title: 'GROWTH_GRID',
        generate: 'MATRIX GENERIEREN',
        calculating: 'BERECHNUNG...',
        placeholder: 'Produktname...',
        headers: 'PERSONA \\ USP',
        details: 'KOORDINATEN',
        hook: 'AUFHÄNGER / SCHLAGZEILE',
        pain: 'SCHMERZPUNKT',
        solution: 'LÖSUNGS-PITCH',
        channel: 'EMPFOHLENER KANAL',
        empty: 'Wählen Sie eine Zelle, um die virale Ladung anzuzeigen.'
    },
    camp: {
        title: 'CHRONOPOSTING-GENERATOR',
        subtitle: 'Erweiterte Konfiguration',
        magic_prompt: 'Taktische Autokonfiguration (Magic Prompt)',
        magic_placeholder: 'Beschreiben Sie Ihr Ziel und die KI passt die Parameter an...',
        generate: 'STRATEGIE GENERIEREN',
        processing: 'VERARBEITUNG...',
        params_time: 'Zeitparameter',
        params_strat: 'Inhaltsstrategie',
        params_res: 'Kanäle und Ressourcen',
        duration: 'DAUER',
        start_date: 'STARTDATUM',
        frequency: 'HÄUFIGKEIT',
        tone: 'TON',
        mix: 'INHALTS-MIX',
        kpi: 'HAUPT-KPI',
        res_level: 'RESSOURCENLEVEL',
        platforms: 'AKTIVE PLATTFORMEN',
        formats: 'SCHLÜSSELFORMATE',
        obj_y: 'STRATEGISCHES ZIEL (Y)',
        active_plan: 'Aktiver Plan',
        production: 'Produktionsanweisungen',
        no_plan: 'KEINE STRATEGIE GENERIERT'
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['es'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
