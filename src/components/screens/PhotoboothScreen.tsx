import { useRef, useState, useEffect, useCallback } from 'react'
import { Camera, SwitchCamera, AlertCircle, Sparkles } from 'lucide-react'
import { CuteButton } from '../ui/CuteButton'
import { PillBadge, SegmentedToggle } from '../ui/PillBadge'
import { cn } from '../../lib/cn'
import type { StripLayout } from '../../utils/strip'

type CaptureMode = 'strip' | 'gif'
type CameraStatus = 'idle' | 'requesting' | 'active' | 'error'

interface FilterDef {
  id: string
  label: string
  emoji: string
  cssFilter: string
}

const FILTERS: FilterDef[] = [
  { id: 'normal', label: 'Asli', emoji: '✨', cssFilter: 'none' },
  { id: 'cute', label: 'Cute', emoji: '🌸', cssFilter: 'saturate(1.3) brightness(1.1) contrast(0.95)' },
  { id: 'soft', label: 'Soft', emoji: '💕', cssFilter: 'brightness(1.1) saturate(0.85) blur(0.3px)' },
  { id: 'vivid', label: 'Vivid', emoji: '🌈', cssFilter: 'saturate(1.6) contrast(1.1)' },
  { id: 'bw', label: 'B&W', emoji: '🖤', cssFilter: 'grayscale(1) contrast(1.1)' },
  { id: 'sepia', label: 'Vintage', emoji: '📜', cssFilter: 'sepia(0.7) contrast(1.05) brightness(1.05)' },
  { id: 'cool', label: 'Cool', emoji: '❄️', cssFilter: 'hue-rotate(180deg) saturate(1.2) brightness(1.05)' },
  { id: 'warm', label: 'Warm', emoji: '🔥', cssFilter: 'sepia(0.3) saturate(1.4) hue-rotate(-10deg) brightness(1.05)' },
  { id: 'dream', label: 'Dream', emoji: '💭', cssFilter: 'blur(0.6px) brightness(1.15) saturate(1.3) contrast(0.9)' },
]

interface PhotoboothScreenProps {
  onBack: () => void
  onCaptureDone: (photos: string[], mode: CaptureMode) => void
  stripLayout: StripLayout
  onStripLayoutChange: (layout: StripLayout) => void
}

export function PhotoboothScreen({ onBack, onCaptureDone, stripLayout, onStripLayoutChange }: PhotoboothScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [status, setStatus] = useState<CameraStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [selectedFilter, setSelectedFilter] = useState<FilterDef>(FILTERS[0])
  const [mode, setMode] = useState<CaptureMode>('strip')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [flash, setFlash] = useState(false)
  const [capturedThumbs, setCapturedThumbs] = useState<string[]>([])

  const startCamera = useCallback(async () => {
    setStatus('requesting')
    setErrorMsg('')
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStatus('active')
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Tidak bisa mengakses kamera. Pastikan izinkan kamera di browser.'
      )
    }
  }, [facingMode])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
    setTimeout(() => startCamera(), 100)
  }

  const captureFrame = useCallback((): string => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return ''

    const w = video.videoWidth || 1280
    const h = video.videoHeight || 720
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    ctx.filter = selectedFilter.cssFilter === 'none' ? 'none' : selectedFilter.cssFilter
    ctx.drawImage(video, 0, 0, w, h)

    setFlash(true)
    setTimeout(() => setFlash(false), 250)

    return canvas.toDataURL('image/png')
  }, [selectedFilter])

  const runCountdown = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      let n = 3
      setCountdown(n)
      const tick = setInterval(() => {
        n -= 1
        if (n <= 0) {
          setCountdown(null)
          clearInterval(tick)
          resolve()
        } else {
          setCountdown(n)
        }
      }, 1000)
    })
  }, [])

  const handleCaptureStrip = useCallback(async () => {
    setIsCapturing(true)
    setCapturedThumbs([])
    const photos: string[] = []
    const count = stripLayout === '3x2' ? 6 : 3

    for (let i = 0; i < count; i++) {
      await runCountdown()
      const photo = captureFrame()
      if (photo) {
        photos.push(photo)
        setCapturedThumbs((prev) => [...prev, photo])
      }
      if (i < count - 1) await new Promise((r) => setTimeout(r, 500))
    }

    setIsCapturing(false)
    setTimeout(() => onCaptureDone(photos, 'strip'), 800)
  }, [runCountdown, captureFrame, onCaptureDone, stripLayout])

  const handleCaptureGif = useCallback(async () => {
    setIsCapturing(true)
    setCapturedThumbs([])
    const photos: string[] = []
    const totalFrames = 12

    await runCountdown()

    for (let i = 0; i < totalFrames; i++) {
      const photo = captureFrame()
      if (photo) {
        photos.push(photo)
        setCapturedThumbs((prev) => [...prev.slice(-5), photo])
      }
      await new Promise((r) => setTimeout(r, 200))
    }

    setIsCapturing(false)
    setTimeout(() => onCaptureDone(photos, 'gif'), 800)
  }, [runCountdown, captureFrame, onCaptureDone])

  const handleCapture = () => {
    if (mode === 'strip') handleCaptureStrip()
    else handleCaptureGif()
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center px-4 py-6">
      {/* Header */}
      <div className="relative z-10 mb-5 flex w-full max-w-md items-center justify-between">
        <CuteButton variant="secondary" size="sm" onClick={onBack}>
          ← Kembali
        </CuteButton>
        <span className="font-display text-lg font-bold text-gradient-lilac">
          🌸 Photobooth
        </span>
        {status === 'active' && (
          <CuteButton
            variant="ghost"
            size="sm"
            onClick={switchCamera}
            icon={<SwitchCamera className="h-4 w-4" />}
          />
        )}
      </div>

      {/* Camera viewport */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className={cn(
            'relative aspect-[3/4] overflow-hidden rounded-[2rem] border-4 border-lilac-300 bg-lilac-900',
            'shadow-[0_8px_40px_rgba(168,85,247,0.25)]',
          )}
        >
          {/* Corner sparkles */}
          <span className="absolute left-3 top-3 z-20 text-xl animate-twinkle">✨</span>
          <span className="absolute right-3 top-3 z-20 text-xl animate-twinkle" style={{ animationDelay: '0.7s' }}>🎀</span>
          <span className="absolute bottom-3 left-3 z-20 text-xl animate-twinkle" style={{ animationDelay: '1.2s' }}>💕</span>
          <span className="absolute bottom-3 right-3 z-20 text-xl animate-twinkle" style={{ animationDelay: '0.4s' }}>✨</span>

          {/* Video / States */}
          {status === 'active' ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{ filter: selectedFilter.cssFilter, transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            />
          ) : status === 'requesting' ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-white/80">
              <Camera className="h-10 w-10 animate-pulse" />
              <p className="font-display text-sm">Memuat kamera... 🌸</p>
            </div>
          ) : status === 'error' ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-white/90">
              <AlertCircle className="h-10 w-10 text-blush" />
              <p className="font-display text-sm">{errorMsg}</p>
              <CuteButton size="sm" onClick={startCamera}>
                Coba Lagi
              </CuteButton>
            </div>
          ) : (
            <div className="flex h-full cursor-pointer flex-col items-center justify-center gap-4 text-white/90 transition-colors hover:text-white" onClick={startCamera}>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Camera className="h-10 w-10 animate-float-bob" />
              </div>
              <p className="font-display text-lg font-bold drop-shadow-lg">
                Mulai Kamera 📸
              </p>
              <p className="font-body max-w-[200px] text-center text-xs text-white/60">
                Klik untuk mengaktifkan kamera
              </p>
            </div>
          )}

          {/* Flash effect */}
          {flash && (
            <div className="absolute inset-0 z-30 bg-white animate-bounce-in" />
          )}

          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-lilac-900/30 backdrop-blur-sm">
              <span
                key={countdown}
                className="font-display text-9xl font-extrabold text-white drop-shadow-[0_4px_20px_rgba(168,85,247,0.6)] animate-bounce-in"
              >
                {countdown}
              </span>
            </div>
          )}

          {/* Captured progress dots */}
          {isCapturing && (
            <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 gap-1.5">
              {Array.from({ length: mode === 'strip' ? (stripLayout === '3x2' ? 6 : 3) : 12 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all duration-300',
                    i < capturedThumbs.length
                      ? 'scale-125 bg-mint shadow-glow'
                      : 'bg-white/30',
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Captured thumbnails */}
        {capturedThumbs.length > 0 && (
          <div className="mt-3 flex justify-center gap-2">
            {capturedThumbs.slice(-6).map((thumb, i) => (
              <img
                key={i}
                src={thumb}
                alt={`Capture ${i + 1}`}
                className="h-14 w-14 rounded-xl border-2 border-lilac-200 object-cover shadow-cute animate-pop-in"
              />
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-10 mt-6 flex w-full max-w-md flex-col items-center gap-4">
        {/* Filter selector */}
        <div className="w-full">
          <p className="font-display mb-2 text-center text-sm font-semibold text-ink-soft">
            ✨ Pilih Filter
          </p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <PillBadge
                key={f.id}
                active={selectedFilter.id === f.id}
                onClick={() => setSelectedFilter(f)}
                icon={<span>{f.emoji}</span>}
              >
                {f.label}
              </PillBadge>
            ))}
          </div>
        </div>

        {/* Layout selector */}
        <div className="w-full">
          <p className="font-display mb-2 text-center text-sm font-semibold text-ink-soft">
            📐 Pilih Layout
          </p>
          <div className="flex justify-center gap-2">
            <PillBadge
              active={stripLayout === '3x1'}
              onClick={() => onStripLayoutChange('3x1')}
              icon={<span>📸</span>}
            >
              3:1
            </PillBadge>
            <PillBadge
              active={stripLayout === '3x2'}
              onClick={() => onStripLayoutChange('3x2')}
              icon={<span>📸</span>}
            >
              3:2
            </PillBadge>
          </div>
        </div>

        {/* Mode toggle + Capture */}
        <div className="flex w-full items-center justify-center gap-4">
          <SegmentedToggle
            value={mode}
            onChange={(v) => setMode(v)}
            options={[
              { value: 'strip', label: 'Strip', icon: '📸' },
              { value: 'gif', label: 'GIF', icon: '🎬' },
            ]}
          />

          {/* Capture button with pulse ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-lilac-400 animate-pulse-ring" />
            <button
              onClick={handleCapture}
              disabled={isCapturing || status !== 'active'}
              className={cn(
                'relative flex h-20 w-20 items-center justify-center rounded-full',
                'bg-gradient-to-br from-lilac-400 to-blush',
                'border-4 border-white shadow-[0_6px_24px_rgba(168,85,247,0.4)]',
                'transition-all duration-200 active:scale-90',
                'disabled:cursor-not-allowed disabled:opacity-50',
                !isCapturing && status === 'active' && 'hover:scale-110',
              )}
              aria-label="Ambil foto"
            >
              {isCapturing ? (
                <Sparkles className="h-7 w-7 animate-twinkle text-white" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white/90" />
              )}
            </button>
          </div>
        </div>

        {/* Mode hint */}
        <p className="font-body text-center text-xs text-ink-faint">
          {mode === 'strip'
            ? `📸 ${stripLayout === '3x2' ? '6' : '3'} foto otomatis dengan countdown`
            : '🎬 12 frame cepat untuk GIF Boomerang'}
        </p>
      </div>
    </div>
  )
}
