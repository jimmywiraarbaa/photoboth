import { useState, useCallback } from 'react'
import { WelcomeScreen } from './components/screens/WelcomeScreen'
import { PhotoboothScreen } from './components/screens/PhotoboothScreen'
import { ResultScreen } from './components/screens/ResultScreen'
import type { StripLayout } from './utils/strip'

type Screen = 'welcome' | 'booth' | 'result'
type CaptureMode = 'strip' | 'gif'

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [photos, setPhotos] = useState<string[]>([])
  const [captureMode, setCaptureMode] = useState<CaptureMode>('strip')
  const [stripLayout, setStripLayout] = useState<StripLayout>('3x1')

  const handleStart = useCallback(() => {
    setScreen('booth')
  }, [])

  const handleBackToWelcome = useCallback(() => {
    setScreen('welcome')
    setPhotos([])
  }, [])

  const handleCaptureDone = useCallback((captured: string[], mode: CaptureMode) => {
    setPhotos(captured)
    setCaptureMode(mode)
    setScreen('result')
  }, [])

  const handleRetake = useCallback(() => {
    setPhotos([])
    setScreen('booth')
  }, [])

  const handleHome = useCallback(() => {
    setPhotos([])
    setScreen('welcome')
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {screen === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {screen === 'booth' && (
        <PhotoboothScreen
          onBack={handleBackToWelcome}
          onCaptureDone={handleCaptureDone}
          stripLayout={stripLayout}
          onStripLayoutChange={setStripLayout}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          photos={photos}
          mode={captureMode}
          stripLayout={stripLayout}
          onRetake={handleRetake}
          onHome={handleHome}
        />
      )}
    </div>
  )
}
