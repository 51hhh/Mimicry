export interface ThemeColors {
  bg: string
  surface: string
  surfaceHover: string
  surfaceActive: string
  border: string
  borderHover: string
  text: string
  textMuted: string
  textInverse: string
  primary: string
  accent: string
  // Semantic
  success: string
  warning: string
  error: string
  info: string
  // Separators
  separator: string
  separatorLight: string
  // Monaco
  monacoTheme: 'vs-dark' | 'vs' | string
}

export interface ThemeDefinition {
  id: string
  name: string
  type: 'dark' | 'light'
  colors: ThemeColors
}

export const themes: ThemeDefinition[] = [
  {
    id: 'dark',
    name: 'Dark',
    type: 'dark',
    colors: {
      bg: '#1e1e1e',
      surface: '#252526',
      surfaceHover: '#2a2d2e',
      surfaceActive: '#37373d',
      border: '#3c3c3c',
      borderHover: '#505050',
      text: '#cccccc',
      textMuted: '#858585',
      textInverse: '#1e1e1e',
      primary: '#0078d4',
      accent: '#0078d4',
      success: '#4ec9b0',
      warning: '#dcdcaa',
      error: '#f44747',
      info: '#9cdcfe',
      separator: 'rgba(255,255,255,0.06)',
      separatorLight: 'rgba(255,255,255,0.03)',
      monacoTheme: 'vs-dark',
    },
  },
  {
    id: 'dark-plus',
    name: 'Dark+',
    type: 'dark',
    colors: {
      bg: '#0f0f0f',
      surface: '#1a1a1a',
      surfaceHover: '#252525',
      surfaceActive: '#2d2d2d',
      border: '#2a2a2a',
      borderHover: '#404040',
      text: '#e0e0e0',
      textMuted: '#888888',
      textInverse: '#0f0f0f',
      primary: '#3b82f6',
      accent: '#3b82f6',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#60a5fa',
      separator: 'rgba(255,255,255,0.06)',
      separatorLight: 'rgba(255,255,255,0.03)',
      monacoTheme: 'vs-dark',
    },
  },
  {
    id: 'monokai',
    name: 'Monokai',
    type: 'dark',
    colors: {
      bg: '#272822',
      surface: '#2d2e27',
      surfaceHover: '#3e3d32',
      surfaceActive: '#49483e',
      border: '#3e3d32',
      borderHover: '#575650',
      text: '#f8f8f2',
      textMuted: '#90908a',
      textInverse: '#272822',
      primary: '#a6e22e',
      accent: '#a6e22e',
      success: '#a6e22e',
      warning: '#e6db74',
      error: '#f92672',
      info: '#66d9ef',
      separator: 'rgba(255,255,255,0.06)',
      separatorLight: 'rgba(255,255,255,0.03)',
      monacoTheme: 'vs-dark',
    },
  },
  {
    id: 'light',
    name: 'Light',
    type: 'light',
    colors: {
      bg: '#f3f3f3',
      surface: '#ffffff',
      surfaceHover: '#e8e8e8',
      surfaceActive: '#dcdcdc',
      border: '#d4d4d4',
      borderHover: '#b0b0b0',
      text: '#333333',
      textMuted: '#616161',
      textInverse: '#ffffff',
      primary: '#0078d4',
      accent: '#0078d4',
      success: '#16825d',
      warning: '#bf8803',
      error: '#cd3131',
      info: '#0451a5',
      separator: 'rgba(0,0,0,0.06)',
      separatorLight: 'rgba(0,0,0,0.03)',
      monacoTheme: 'vs',
    },
  },
  {
    id: 'light-plus',
    name: 'Light+',
    type: 'light',
    colors: {
      bg: '#f5f5f5',
      surface: '#ffffff',
      surfaceHover: '#f0f0f0',
      surfaceActive: '#e5e5e5',
      border: '#e0e0e0',
      borderHover: '#c0c0c0',
      text: '#1a1a1a',
      textMuted: '#666666',
      textInverse: '#ffffff',
      primary: '#3b82f6',
      accent: '#3b82f6',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#60a5fa',
      separator: 'rgba(0,0,0,0.06)',
      separatorLight: 'rgba(0,0,0,0.03)',
      monacoTheme: 'vs',
    },
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    type: 'dark',
    colors: {
      bg: '#002b36',
      surface: '#073642',
      surfaceHover: '#094753',
      surfaceActive: '#0b5364',
      border: '#094753',
      borderHover: '#2aa198',
      text: '#839496',
      textMuted: '#586e75',
      textInverse: '#002b36',
      primary: '#268bd2',
      accent: '#268bd2',
      success: '#859900',
      warning: '#b58900',
      error: '#dc322f',
      info: '#2aa198',
      separator: 'rgba(131,148,150,0.1)',
      separatorLight: 'rgba(131,148,150,0.05)',
      monacoTheme: 'vs-dark',
    },
  },
]

export function getThemeById(id: string): ThemeDefinition {
  return themes.find((t) => t.id === id) || themes[0]
}

export function applyThemeToDOM(theme: ThemeDefinition, accentColor?: string) {
  const root = document.documentElement
  const c = theme.colors

  root.setAttribute('data-theme', theme.type)
  root.style.setProperty('--color-bg', c.bg)
  root.style.setProperty('--color-surface', c.surface)
  root.style.setProperty('--color-surface-hover', c.surfaceHover)
  root.style.setProperty('--color-surface-active', c.surfaceActive)
  root.style.setProperty('--color-border', c.border)
  root.style.setProperty('--color-border-hover', c.borderHover)
  root.style.setProperty('--color-text', c.text)
  root.style.setProperty('--color-text-muted', c.textMuted)
  root.style.setProperty('--color-text-inverse', c.textInverse)
  root.style.setProperty('--color-primary', accentColor || c.primary)
  root.style.setProperty('--color-accent', accentColor || c.accent)
  root.style.setProperty('--color-success', c.success)
  root.style.setProperty('--color-warning', c.warning)
  root.style.setProperty('--color-error', c.error)
  root.style.setProperty('--color-info', c.info)
  root.style.setProperty('--color-separator', c.separator)
  root.style.setProperty('--color-separator-light', c.separatorLight)
}
