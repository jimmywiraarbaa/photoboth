import { type FrameTheme, DEFAULT_THEME } from './themes'

export type StripLayout = '3x1' | '3x2'

export interface StripOptions {
  photos: string[]
  title?: string
  date?: string
  theme?: FrameTheme
  layout?: StripLayout
}

export async function composePhotoStrip(options: StripOptions): Promise<string> {
  const {
    photos,
    date,
    theme = DEFAULT_THEME,
    layout = '3x1',
  } = options

  if (photos.length === 0) return ''

  const PADDING = 20
  const HEADER_H = 14
  const FOOTER_H = 80
  const GAP = 14
  const CORNER_FONT = '24px sans-serif'
  const PATTERN_SIZE = 4

  const isWide = layout === '3x2'
  const STRIP_W = isWide ? 600 : 400
  const COLS = isWide ? 2 : 1
  const COL_GAP = isWide ? GAP : 0
  const PHOTO_W = (STRIP_W - PADDING * 2 - (COLS - 1) * COL_GAP) / COLS
  const PHOTO_H = isWide ? 230 : 300
  const ROWS = Math.ceil(photos.length / COLS)

  const totalHeight =
    HEADER_H +
    PADDING +
    ROWS * PHOTO_H +
    (ROWS - 1) * GAP +
    FOOTER_H +
    PADDING

  const canvas = document.createElement('canvas')
  canvas.width = STRIP_W
  canvas.height = totalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // Background
  ctx.fillStyle = theme.bgColor
  ctx.beginPath()
  ctx.roundRect(0, 0, STRIP_W, totalHeight, 24)
  ctx.fill()

  // Accent top bar
  ctx.fillStyle = theme.accentColor
  ctx.beginPath()
  ctx.roundRect(0, 0, STRIP_W, 8, [24, 24, 0, 0])
  ctx.fill()

  // Load and draw photos
  const loadedPhotos = await Promise.all(
    photos.map(
      (src) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = src
        }),
    ),
  )

  loadedPhotos.forEach((img, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    const x = PADDING + col * (PHOTO_W + COL_GAP)
    const y = HEADER_H + PADDING + row * (PHOTO_H + GAP)
    const w = PHOTO_W

    // Photo border background
    ctx.save()
    ctx.fillStyle = theme.photoBorderColor
    ctx.beginPath()
    ctx.roundRect(x - 3, y - 3, w + 6, PHOTO_H + 6, 18)
    ctx.fill()
    ctx.restore()

    // Clip rounded rect for photo
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(x, y, w, PHOTO_H, 16)
    ctx.clip()

    // Cover-fit
    const imgRatio = img.width / img.height
    const boxRatio = w / PHOTO_H
    let sx = 0,
      sy = 0,
      sw = img.width,
      sh = img.height
    if (imgRatio > boxRatio) {
      sw = img.height * boxRatio
      sx = (img.width - sw) / 2
    } else {
      sh = img.width / boxRatio
      sy = (img.height - sh) / 2
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, PHOTO_H)
    ctx.restore()
  })

  // Corner emojis
  if (theme.cornerEmojis) {
    ctx.font = CORNER_FONT
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const positions: [number, number][] = [
      [PADDING + 6, HEADER_H + PADDING + 6],
      [STRIP_W - PADDING - 6, HEADER_H + PADDING + 6],
      [PADDING + 6, totalHeight - FOOTER_H - PADDING + 6],
      [STRIP_W - PADDING - 6, totalHeight - FOOTER_H - PADDING + 6],
    ]
    theme.cornerEmojis.forEach((emoji, i) => {
      ctx.fillText(emoji, positions[i][0], positions[i][1])
    })
  }

  // Footer text
  const footerY = totalHeight - FOOTER_H + 28
  ctx.fillStyle = theme.textColor
  ctx.font = '700 20px "Baloo 2", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(theme.title, STRIP_W / 2, footerY)

  if (date) {
    ctx.fillStyle = theme.subtextColor
    ctx.font = '500 13px "Quicksand", sans-serif'
    ctx.fillText(date, STRIP_W / 2, footerY + 22)
  }

  // Footer decorative pattern
  drawFooterPattern(ctx, theme, STRIP_W, footerY + 38, PATTERN_SIZE)

  return canvas.toDataURL('image/png')
}

function drawFooterPattern(
  ctx: CanvasRenderingContext2D,
  theme: FrameTheme,
  stripWidth: number,
  y: number,
  size: number,
) {
  ctx.fillStyle = theme.accentColor
  ctx.strokeStyle = theme.accentColor

  switch (theme.pattern) {
    case 'dots': {
      ctx.globalAlpha = 0.3
      const count = 7
      const spacing = 32
      const startX = stripWidth / 2 - ((count - 1) * spacing) / 2
      for (let i = 0; i < count; i++) {
        ctx.beginPath()
        ctx.arc(startX + i * spacing, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'hearts': {
      ctx.globalAlpha = 0.4
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const count = 5
      const spacing = 40
      const startX = stripWidth / 2 - ((count - 1) * spacing) / 2
      for (let i = 0; i < count; i++) {
        ctx.fillText('🌸', startX + i * spacing, y)
      }
      break
    }
    case 'stars': {
      ctx.globalAlpha = 0.5
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const count = 6
      const spacing = 36
      const startX = stripWidth / 2 - ((count - 1) * spacing) / 2
      for (let i = 0; i < count; i++) {
        ctx.fillText(i % 2 === 0 ? '✦' : '✧', startX + i * spacing, y)
      }
      break
    }
    case 'lines': {
      ctx.globalAlpha = 0.15
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(60, y)
      ctx.lineTo(stripWidth - 60, y)
      ctx.stroke()
      break
    }
  }

  ctx.globalAlpha = 1
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function formatDate(date: Date = new Date()): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}
