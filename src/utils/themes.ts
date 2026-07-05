export interface FrameTheme {
  id: string
  label: string
  emoji: string
  bgColor: string
  accentColor: string
  textColor: string
  subtextColor: string
  photoBorderColor: string
  cornerEmojis: [string, string, string, string] | null
  title: string
  pattern: 'dots' | 'hearts' | 'stars' | 'lines'
}

export const FRAME_THEMES: FrameTheme[] = [
  {
    id: 'sakura',
    label: 'Sakura',
    emoji: '🌸',
    bgColor: '#FFF0F5',
    accentColor: '#F48FB1',
    textColor: '#AD1457',
    subtextColor: '#D81B60',
    photoBorderColor: '#F8BBD0',
    cornerEmojis: ['🌸', '🌸', '🌸', '🌸'],
    title: '🌸 Sakura Booth',
    pattern: 'hearts',
  },
  {
    id: 'ribbon',
    label: 'Ribbon',
    emoji: '🎀',
    bgColor: '#F3E8FF',
    accentColor: '#C084FC',
    textColor: '#7E22CE',
    subtextColor: '#9333EA',
    photoBorderColor: '#D8B4FE',
    cornerEmojis: ['🎀', '🎀', '🎀', '🎀'],
    title: '🎀 Ribbon Cutie',
    pattern: 'dots',
  },
  {
    id: 'sparkle',
    label: 'Sparkle',
    emoji: '✨',
    bgColor: '#2D1B4E',
    accentColor: '#FBBF24',
    textColor: '#FDE68A',
    subtextColor: '#FCD34D',
    photoBorderColor: '#FBBF24',
    cornerEmojis: ['✨', '⭐', '✨', '⭐'],
    title: '✨ Sparkle Night',
    pattern: 'stars',
  },
  {
    id: 'classic',
    label: 'Classic',
    emoji: '🖤',
    bgColor: '#FFFFFF',
    accentColor: '#1F1F1F',
    textColor: '#1F1F1F',
    subtextColor: '#525252',
    photoBorderColor: '#E0E0E0',
    cornerEmojis: null,
    title: 'Photobooth',
    pattern: 'lines',
  },
]

export const DEFAULT_THEME = FRAME_THEMES[1]

export function getThemeById(id: string): FrameTheme {
  return FRAME_THEMES.find((t) => t.id === id) ?? DEFAULT_THEME
}
