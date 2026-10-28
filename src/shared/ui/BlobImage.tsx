type BlobImageProps = { blob: Blob; width: number; height: number }

// The photo inside an <svg>, from a downloaded Blob.
export function BlobImage({ blob, width, height }: BlobImageProps) {
  return (
    <image
      width={width}
      height={height}
      // The ref owns the object URL: created on mount, revoked on unmount.
      ref={(image) => {
        if (!image) return
        const url = URL.createObjectURL(blob)
        image.setAttribute('href', url)
        return () => URL.revokeObjectURL(url)
      }}
    />
  )
}
