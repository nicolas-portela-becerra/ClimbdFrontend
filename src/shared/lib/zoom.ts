export type ZoomView = { scale: number; x: number; y: number }

export const MIN_SCALE = 1
export const MAX_SCALE = 4

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

// Keeps the zoomed content covering the whole container: it can't be dragged away from the edges, and at
// scale 1 it sits at 0,0. `width`/`height` are the container's size.
export function clampView(view: ZoomView, width: number, height: number): ZoomView {
  const scale = clamp(view.scale, MIN_SCALE, MAX_SCALE)
  return {
    scale,
    x: clamp(view.x, width - width * scale, 0),
    y: clamp(view.y, height - height * scale, 0),
  }
}

// Changes the scale keeping the content point under (cx, cy) (container coordinates) where it is.
export function zoomAt(
  view: ZoomView,
  nextScale: number,
  cx: number,
  cy: number,
  width: number,
  height: number,
): ZoomView {
  const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE)
  const k = scale / view.scale
  return clampView({ scale, x: cx - (cx - view.x) * k, y: cy - (cy - view.y) * k }, width, height)
}

export function panBy(view: ZoomView, dx: number, dy: number, width: number, height: number) {
  return clampView({ ...view, x: view.x + dx, y: view.y + dy }, width, height)
}
