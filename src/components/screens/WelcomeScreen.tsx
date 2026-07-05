import { Sparkles, Heart } from 'lucide-react'
import { CuteButton } from '../ui/CuteButton'
import { FloatingDecorations } from '../decorations/FloatingDecorations'

interface WelcomeScreenProps {
  onStart: () => void
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-12">
      <FloatingDecorations />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Mascot emoji cluster */}
        <div className="mb-8 flex items-center gap-3 animate-bounce-in">
          <span className="text-5xl">📸</span>
          <span className="text-4xl animate-twinkle">🌸</span>
          <span className="text-5xl">🎀</span>
        </div>

        {/* Title */}
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-lilac-400 animate-twinkle" />
          <h1 className="font-display text-5xl font-extrabold text-gradient-lilac sm:text-6xl">
            Photobooth
          </h1>
          <Sparkles className="h-7 w-7 text-blush animate-twinkle" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Tagline */}
        <p className="font-body mb-10 text-lg text-ink-soft">
          ~ Snap, Style & Share keseruanmu ~
        </p>

        {/* Feature pills */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {[
            { icon: '📸', label: 'Photo Strip' },
            { icon: '✨', label: 'Filter Lucu' },
            { icon: '🎬', label: 'GIF Boomerang' },
            { icon: '📤', label: 'Share Mudah' },
          ].map((f, i) => (
            <span
              key={f.label}
              className="font-body inline-flex items-center gap-1.5 rounded-full border-2 border-lilac-200 bg-white/70 px-4 py-2 text-sm font-medium text-ink-soft shadow-cute animate-pop-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-base">{f.icon}</span>
              {f.label}
            </span>
          ))}
        </div>

        {/* Start button */}
        <CuteButton
          size="xl"
          onClick={onStart}
          icon={<Sparkles className="h-5 w-5" />}
          className="font-display text-xl"
        >
          Mulai Seru-Seruan!
        </CuteButton>

        {/* Footer hint */}
        <div className="mt-12 flex items-center gap-1.5 text-sm text-ink-faint">
          <Heart className="h-4 w-4 fill-blush text-blush" />
          <span>Izinkan kamera untuk memulai</span>
          <Heart className="h-4 w-4 fill-blush text-blush" />
        </div>
      </div>
    </div>
  )
}
