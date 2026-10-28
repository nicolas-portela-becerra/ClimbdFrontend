// Picks the background of the gym logo square so the logo stays readable, without changing the image.
// `data` is RGBA pixel data (as in ImageData) of the logo drawn at a small size.

const ALPHA_OPAQUE = 128
// Contrast ratio (WCAG) below which a pixel is considered hard to see against the background.
const MIN_CONTRAST = 3
// Below this share of transparent pixels the image is treated as opaque (a photo/JPEG-like logo).
const OPAQUE_SHARE = 0.05

function linear(channel: number): number {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance(r: number, g: number, b: number): number {
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

export function chooseLogoBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): string {
  const total = width * height
  let transparent = 0
  let hardOnWhite = 0
  let hardOnBlack = 0

  for (let i = 0; i < total; i++) {
    const r = data[i * 4] ?? 0
    const g = data[i * 4 + 1] ?? 0
    const b = data[i * 4 + 2] ?? 0
    const a = data[i * 4 + 3] ?? 0
    if (a < ALPHA_OPAQUE) {
      transparent += 1
      continue
    }
    const l = luminance(r, g, b)
    if (1.05 / (l + 0.05) < MIN_CONTRAST) hardOnWhite += 1
    if ((l + 0.05) / 0.05 < MIN_CONTRAST) hardOnBlack += 1
  }

  if (transparent / total < OPAQUE_SHARE) return averageEdgeColor(data, width, height)
  // Transparent logo: the background with fewer hard-to-see pixels wins.
  return hardOnWhite > hardOnBlack ? '#000' : '#fff'
}

// For logos without transparency the bars around them take the colour of the image's own edge.
function averageEdgeColor(data: Uint8ClampedArray, width: number, height: number): string {
  let r = 0
  let g = 0
  let b = 0
  let count = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x !== 0 && y !== 0 && x !== width - 1 && y !== height - 1) continue
      const i = (y * width + x) * 4
      r += data[i] ?? 0
      g += data[i + 1] ?? 0
      b += data[i + 2] ?? 0
      count += 1
    }
  }
  return `rgb(${Math.round(r / count)} ${Math.round(g / count)} ${Math.round(b / count)})`
}
