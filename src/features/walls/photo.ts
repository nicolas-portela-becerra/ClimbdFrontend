import type { ParseKeys } from 'i18next'
import { isAcceptedImage } from '@/shared/lib/images'

// Limit enforced by the backend.
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export function validatePhoto(file: Blob): ParseKeys<'walls'> | null {
  if (!isAcceptedImage(file)) return 'errors.wrongType'
  if (file.size > MAX_UPLOAD_BYTES) return 'errors.tooLarge'
  return null
}

// Bakes a rotation (multiple of 90°) into the pixels and re-encodes as JPEG. The decoder applies the
// EXIF orientation, so the result matches what the preview shows and carries no EXIF itself.
export async function rotatePhoto(file: File, degrees: number): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const sideways = degrees % 180 !== 0
  const canvas = document.createElement('canvas')
  canvas.width = sideways ? bitmap.height : bitmap.width
  canvas.height = sideways ? bitmap.width : bitmap.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is not supported')
  context.translate(canvas.width / 2, canvas.height / 2)
  context.rotate((degrees * Math.PI) / 180)
  context.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.92),
  )
  if (!blob) throw new Error('Could not process the photo')
  return new File([blob], file.name, { type: 'image/jpeg' })
}
