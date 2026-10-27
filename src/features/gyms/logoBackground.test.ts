import { describe, expect, it } from 'vitest'
import { chooseLogoBackground } from './logoBackground'

type Pixel = [number, number, number, number]

function image(width: number, height: number, pixel: (x: number, y: number) => Pixel) {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) data.set(pixel(x, y), (y * width + x) * 4)
  }
  return { data, width, height }
}

const CLEAR: Pixel = [0, 0, 0, 0]
const WHITE: Pixel = [255, 255, 255, 255]
const BLACK: Pixel = [20, 20, 20, 255]
const YELLOW: Pixel = [242, 209, 45, 255]

describe('chooseLogoBackground', () => {
  it('uses black behind a transparent logo with white content', () => {
    const { data, width, height } = image(10, 10, (x) => (x < 5 ? WHITE : CLEAR))
    expect(chooseLogoBackground(data, width, height)).toBe('#000')
  })

  it('uses white behind a transparent logo with dark content', () => {
    const { data, width, height } = image(10, 10, (x) => (x < 5 ? BLACK : CLEAR))
    expect(chooseLogoBackground(data, width, height)).toBe('#fff')
  })

  it('uses black for a yellow box with dark letters and a few white lines (Artabros-like)', () => {
    const { data, width, height } = image(20, 10, (x, y) => {
      if (y === 0) return CLEAR
      if (y === 9) return x < 8 ? WHITE : CLEAR
      return x % 4 === 0 ? BLACK : YELLOW
    })
    expect(chooseLogoBackground(data, width, height)).toBe('#000')
  })

  it('uses the edge colour for an image without transparency', () => {
    const { data, width, height } = image(6, 6, (x, y) =>
      x === 0 || y === 0 || x === 5 || y === 5 ? [10, 20, 30, 255] : WHITE,
    )
    expect(chooseLogoBackground(data, width, height)).toBe('rgb(10 20 30)')
  })
})
