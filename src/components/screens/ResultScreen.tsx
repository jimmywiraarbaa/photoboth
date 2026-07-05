import { useState, useEffect, useRef } from 'react'
import { Download, Share2, RotateCcw, Sparkles, Image as ImageIcon, Frame } from 'lucide-react'
import { CuteButton } from '../ui/CuteButton'
import { CuteCard } from '../ui/CuteCard'
import { PillBadge } from '../ui/PillBadge'
import { SparkleBurst } from '../decorations/FloatingDecorations'
import { composePhotoStrip, downloadDataUrl, formatDate, type StripLayout } from '../../utils/strip'
import { FRAME_THEMES, DEFAULT_THEME, type FrameTheme } from '../../utils/themes'
import { cn } from '../../lib/cn'

type CaptureMode = 'strip' | 'gif'

interface ResultScreenProps {
  photos: string[]
  mode: CaptureMode
  stripLayout: StripLayout
  onRetake: () => void
  onHome: () => void
}

export function ResultScreen({ photos, mode, stripLayout, onRetake, onHome }: ResultScreenProps) {
  const [stripImage, setStripImage] = useState<string>('')
  const [selectedTheme, setSelectedTheme] = useState<FrameTheme>(DEFAULT_THEME)
  const [gifFrame, setGifFrame] = useState(0)
  const [showBurst, setShowBurst] = useState(true)
  const frameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Compose photo strip (re-renders when theme changes)
  useEffect(() => {
    if (mode === 'strip' && photos.length > 0) {
      composePhotoStrip({
        photos,
        date: formatDate(),
        theme: selectedTheme,
        layout: stripLayout,
      }).then(setStripImage)
    }
  }, [photos, mode, selectedTheme])

  // GIF cycling preview
  useEffect(() => {
    if (mode === 'gif' && photos.length > 0) {
      frameTimerRef.current = setInterval(() => {
        setGifFrame((prev) => (prev + 1) % photos.length)
      }, 180)
      return () => {
        if (frameTimerRef.current) clearInterval(frameTimerRef.current)
      }
    }
  }, [photos, mode])

  // Hide sparkle burst after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowBurst(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleDownload = () => {
    if (mode === 'strip' && stripImage) {
      downloadDataUrl(stripImage, `photobooth-strip-${Date.now()}.png`)
    } else if (mode === 'gif' && photos.length > 0) {
      photos.forEach((p, i) => downloadDataUrl(p, `photobooth-frame-${i + 1}.png`))
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        if (mode === 'strip' && stripImage) {
          const blob = await (await fetch(stripImage)).blob()
          const file = new File([blob], 'photobooth.png', { type: 'image/png' })
          await navigator.share({ files: [file], title: 'Photobooth Lilac' })
        } else {
          await navigator.share({ title: 'Photobooth Lilac', text: 'Lihat foto photobooth aku! 🌸' })
        }
      } catch {
        // User cancelled share
      }
    } else {
      handleDownload()
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center px-4 py-6">
      {showBurst && <SparkleBurst count={16} />}

      {/* Header */}
      <div className="relative z-10 mb-5 flex w-full max-w-md items-center justify-between">
        <CuteButton variant="secondary" size="sm" onClick={onRetake} icon={<RotateCcw className="h-4 w-4" />}>
          Ambil Lagi
        </CuteButton>
        <span className="font-display text-lg font-bold text-gradient-lilac">
          ✨ Hasil Foto
        </span>
        <CuteButton variant="ghost" size="sm" onClick={onHome}>
          🏠
        </CuteButton>
      </div>

      {/* Result preview */}
      <div className="relative z-10 w-full max-w-sm">
        <CuteCard variant="solid" className="overflow-hidden p-5">
          <div className="flex items-center justify-center">
            {mode === 'strip' ? (
              stripImage ? (
                <img
                  src={stripImage}
                  alt="Photo Strip"
                  className="w-full max-w-[260px] rounded-2xl shadow-cute animate-pop-in"
                />
              ) : (
                <div className="flex aspect-[2/5] w-full max-w-[260px] items-center justify-center rounded-2xl bg-lilac-100">
                  <Sparkles className="h-8 w-8 animate-twinkle text-lilac-400" />
                </div>
              )
            ) : (
              <div className="relative aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-2xl bg-lilac-900">
                {photos.map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    alt={`Frame ${i + 1}`}
                    className={cn(
                      'absolute inset-0 h-full w-full object-cover transition-opacity duration-100',
                      i === gifFrame ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                ))}
                {/* GIF badge */}
                <span className="absolute right-2 top-2 rounded-full bg-lilac-500/80 px-2 py-0.5 font-display text-xs font-bold text-white backdrop-blur">
                  🎬 GIF
                </span>
              </div>
            )}
          </div>
        </CuteCard>

        {/* Photo thumbnails */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {photos.map((p, i) => (
            <img
              key={i}
              src={p}
              alt={`Foto ${i + 1}`}
              className="h-16 w-16 rounded-xl border-2 border-lilac-200 object-cover shadow-cute animate-pop-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      </div>

      {/* Frame theme selector (strip mode only) */}
      {mode === 'strip' && (
        <div className="relative z-10 mt-6 w-full max-w-sm">
          <p className="font-display mb-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-ink-soft">
            <Frame className="h-4 w-4" />
            Pilih Bingkai
          </p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {FRAME_THEMES.map((t) => (
              <PillBadge
                key={t.id}
                active={selectedTheme.id === t.id}
                onClick={() => setSelectedTheme(t)}
                icon={<span>{t.emoji}</span>}
              >
                {t.label}
              </PillBadge>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="relative z-10 mt-8 flex w-full max-w-sm flex-col gap-3">
        <div className="flex gap-3">
          <CuteButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleDownload}
            icon={<Download className="h-5 w-5" />}
          >
            Simpan
          </CuteButton>
          <CuteButton
            variant="mint"
            size="lg"
            fullWidth
            onClick={handleShare}
            icon={<Share2 className="h-5 w-5" />}
          >
            Share
          </CuteButton>
        </div>

        {/* Mode-specific hint */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-ink-faint">
          <ImageIcon className="h-3.5 w-3.5" />
          {mode === 'gif'
            ? 'Frame disimpan terpisah — gabung jadi GIF dengan app favoritmu!'
            : 'Strip foto siap dicetak atau di-share!'}
        </div>
      </div>
    </div>
  )
}
