import { describe, expect, it } from 'vitest'
import { clampView, MAX_SCALE, panBy, zoomAt } from './zoom'

const W = 400
const H = 800
const rest = { scale: 1, x: 0, y: 0 }

describe('zoomAt', () => {
  it('keeps the content point under the zoom centre in place', () => {
    const view = zoomAt(rest, 2, 300, 200, W, H)
    // content point under (300,200) before: (300,200); after: (x + 300*2, y + 200*2) must be (300,200)
    expect(view.x + 300 * view.scale).toBeCloseTo(300)
    expect(view.y + 200 * view.scale).toBeCloseTo(200)
    expect(view.scale).toBe(2)
  })

  it('never zooms out past 1x or in past the maximum', () => {
    expect(zoomAt(rest, 0.3, 100, 100, W, H)).toEqual(rest)
    expect(zoomAt(rest, 99, 100, 100, W, H).scale).toBe(MAX_SCALE)
  })

  it('returns to the origin when zooming back out to 1x', () => {
    const zoomed = zoomAt(rest, 3, 350, 700, W, H)
    expect(zoomAt(zoomed, 1, 350, 700, W, H)).toEqual(rest)
  })
})

describe('clampView / panBy', () => {
  it('does not let the content leave the container', () => {
    const view = { scale: 2, x: 0, y: 0 }
    expect(panBy(view, 500, 500, W, H)).toEqual({ scale: 2, x: 0, y: 0 })
    expect(panBy(view, -5000, -5000, W, H)).toEqual({ scale: 2, x: -W, y: -H })
  })

  it('cannot pan at 1x', () => {
    expect(panBy(rest, -50, -50, W, H)).toEqual(rest)
    expect(clampView({ scale: 1, x: -10, y: 10 }, W, H)).toEqual(rest)
  })
})
