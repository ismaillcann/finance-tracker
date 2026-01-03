export const colors = {
    light: {
        primary: '#1e293b',      // Slate 800 - Professional dark
        secondary: '#64748b',    // Slate 500 - Muted secondary
        background: '#f8fafc',   // Slate 50 - Clean background
        surface: '#ffffff',
        card: '#ffffff',
        text: '#0f172a',         // Slate 900
        textSecondary: '#64748b', // Slate 500
        border: '#e2e8f0',       // Slate 200
        success: '#10b981',      // Emerald 500
        error: '#ef4444',        // Red 500
        warning: '#f59e0b',      // Amber 500
        chart: {
            up: '#10b981',
            down: '#ef4444',
            line: '#6366f1',     // Indigo 500 - Professional chart color
            volume: '#94a3b8',
        },
    },
    dark: {
        primary: '#1e293b',      // Slate 800 - Consistent with light
        secondary: '#475569',    // Slate 600
        background: '#0f172a',   // Slate 900 - Deep dark
        surface: '#1e293b',      // Slate 800
        card: '#1e293b',
        text: '#f1f5f9',         // Slate 100
        textSecondary: '#94a3b8', // Slate 400
        border: '#334155',       // Slate 700
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        chart: {
            up: '#10b981',
            down: '#ef4444',
            line: '#818cf8',     // Indigo 400 - Brighter for dark mode
            volume: '#64748b',
        },
    },
} as const;

export type ColorScheme = 'light' | 'dark';
export type Colors = typeof colors.light;
