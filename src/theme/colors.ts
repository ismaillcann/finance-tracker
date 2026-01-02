export const colors = {
    light: {
        primary: '#2563eb',
        secondary: '#8b5cf6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#0f172a',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        chart: {
            up: '#10b981',
            down: '#ef4444',
            line: '#2563eb',
            volume: '#94a3b8',
        },
    },
    dark: {
        primary: '#3b82f6',
        secondary: '#a78bfa',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        border: '#334155',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        chart: {
            up: '#10b981',
            down: '#ef4444',
            line: '#3b82f6',
            volume: '#64748b',
        },
    },
} as const;

export type ColorScheme = 'light' | 'dark';
export type Colors = typeof colors.light;
