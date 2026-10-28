import { useCallback } from 'react'
import { cn } from '@/shared/lib/cn'

type AuthImageProps = {
  blob: Blob | undefined
  alt: string
  className?: string
}

// Shows an image that was downloaded with the login token. Until the blob is there the <img> has no
// source, so the parent's placeholder stays visible (also if loading fails).
export function AuthImage({ blob, alt, className }: AuthImageProps) {
  // The ref callback owns the object URL: created when the element mounts, revoked when it unmounts.
  const attach = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img || !blob) return
      const url = URL.createObjectURL(blob)
      img.src = url
      return () => URL.revokeObjectURL(url)
    },
    [blob],
  )

  return <img ref={attach} alt={alt} className={cn('size-full object-cover', className)} />
}
