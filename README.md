# Photobooth Lilac 🌸✨

Web-based photobooth simulator — take photos via camera, apply CSS filters, create photo strips or GIF bursts, then download and share.

## Features

- **Camera capture** — front camera with live preview
- **Filters** — 9 CSS filters (Cute, Soft, Vivid, B&W, Vintage, Cool, Warm, Dream)
- **Strip mode** — 3 or 6 photos arranged in 3×1 or 3×2 layout
- **GIF mode** — 12-frame burst for boomerang-style animation
- **Frame themes** — 12 themes (Sakura, Ribbon, Sparkle, Classic, Ocean, Sunset, Mint, Midnight, Cotton Candy, Retro, Tropical, Golden)
- **Download & Share** — save strip as PNG or share via native share sheet

## Tech Stack

React 18, TypeScript, Vite 6, Tailwind CSS v4, Lucide React

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

```bash
npm run build
# then connect the repo to vercel.com — auto-detected as Vite
```

A `vercel.json` is included with `Permissions-Policy: camera=*` header.

## Project Structure

```
src/
├── App.tsx                        # Root: screen navigation + layout state
├── components/
│   ├── screens/
│   │   ├── WelcomeScreen.tsx       # Landing page
│   │   ├── PhotoboothScreen.tsx    # Camera, capture, filters
│   │   └── ResultScreen.tsx        # Preview, theme picker, download
│   ├── ui/                         # Reusable UI primitives
│   └── decorations/
├── utils/
│   ├── strip.ts                    # Photo strip canvas composition
│   └── themes.ts                   # Frame theme definitions
└── lib/
    └── cn.ts                       # clsx + tailwind-merge utility
```

## Layout Options

| Layout | Photos | Strip Width |
|---|---|---|
| 3×1 | 3 | 400px |
| 3×2 | 6 | 600px |

## License

MIT
