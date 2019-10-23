import React from 'react'

export default function Avatar({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [dataSrc, setDataSrc] = React.useState(src)

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      data-src={dataSrc}
      onLoad={() => setDataSrc(undefined)}
    />
  )
}
