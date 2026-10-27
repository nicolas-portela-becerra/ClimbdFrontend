import { useState, type SyntheticEvent } from 'react'
import { chooseLogoBackground } from '../logoBackground'

// Side of the small canvas the logo is analysed on.
const ANALYSIS_SIDE = 64

// The whole logo, fitted inside a square (never cropped). The background is picked from the logo's
// own pixels so both light and dark logos stay readable; the image itself is shown untouched.
export function GymLogo({ src }: { src: string }) {
  const [background, setBackground] = useState<string | null>(null)

  const analyse = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    if (!img.naturalWidth || !img.naturalHeight) return
    const scale = Math.min(1, ANALYSIS_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
    const width = Math.max(1, Math.round(img.naturalWidth * scale))
    const height = Math.max(1, Math.round(img.naturalHeight * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) return
    context.drawImage(img, 0, 0, width, height)
    setBackground(
      chooseLogoBackground(context.getImageData(0, 0, width, height).data, width, height),
    )
  }

  return (
    <div
      className="size-16 shrink-0 bg-neutral-800"
      style={background ? { backgroundColor: background } : undefined}
    >
      <img src={src} alt="" onLoad={analyse} className="size-full object-contain" />
    </div>
  )
}
