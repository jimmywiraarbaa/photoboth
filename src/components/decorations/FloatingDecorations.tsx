import { useMemo } from 'react'
import { cn } from '../../lib/cn'

interface DecorationItem {
  emoji: string
  top: string
  left: string
  size: string
  animation: string
  delay: string
  opacity: string
}

const EMOJIS = ['✨', '🌸', '🎀', '☁️', '💕', '⭐', '🫧', '💫', '🩷', '🌟']

const DECORATIONS: DecorationItem[] = [
  { emoji: '✨', top: '8%', left: '12%', size: 'text-3xl', animation: 'animate-float-bob', delay: '0s', opacity: 'opacity-80' },
  { emoji: '🌸', top: '15%', left: '82%', size: 'text-4xl', animation: 'animate-float-bob-slow', delay: '0.5s', opacity: 'opacity-70' },
  { emoji: '🎀', top: '72%', left: '8%', size: 'text-3xl', animation: 'animate-float-bob', delay: '1s', opacity: 'opacity-60' },
  { emoji: '☁️', top: '60%', left: '88%', size: 'text-5xl', animation: 'animate-float-bob-slow', delay: '1.5s', opacity: 'opacity-50' },
  { emoji: '💕', top: '85%', left: '75%', size: 'text-2xl', animation: 'animate-twinkle', delay: '0s', opacity: 'opacity-70' },
  { emoji: '⭐', top: '25%', left: '50%', size: 'text-2xl', animation: 'animate-twinkle', delay: '0.8s', opacity: 'opacity-60' },
  { emoji: '🫧', top: '45%', left: '5%', size: 'text-3xl', animation: 'animate-float-bob', delay: '2s', opacity: 'opacity-50' },
  { emoji: '💫', top: '38%', left: '92%', size: 'text-2xl', animation: 'animate-twinkle', delay: '1.2s', opacity: 'opacity-60' },
  { emoji: '🩷', top: '90%', left: '30%', size: 'text-xl', animation: 'animate-float-bob-slow', delay: '0.3s', opacity: 'opacity-50' },
  { emoji: '🌟', top: '5%', left: '65%', size: 'text-2xl', animation: 'animate-twinkle', delay: '0.6s', opacity: 'opacity-70' },
]

export function FloatingDecorations({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-0 overflow-hidden',
        className,
      )}
      aria-hidden="true"
    >
      {DECORATIONS.map((item, i) => (
        <span
          key={i}
          className={cn(
            'absolute select-none',
            item.size,
            item.animation,
            item.opacity,
          )}
          style={{
            top: item.top,
            left: item.left,
            animationDelay: item.delay,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  )
}

interface SparkleBurstProps {
  count?: number
  className?: string
}

export function SparkleBurst({ count = 12, className }: SparkleBurstProps) {
  const sparkles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: ['text-lg', 'text-xl', 'text-2xl'][Math.floor(Math.random() * 3)],
      delay: `${Math.random() * 0.8}s`,
    }))
  }, [count])

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 z-10', className)}
      aria-hidden="true"
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          className={cn('absolute animate-bounce-in select-none', s.size)}
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  )
}
