import React from 'react'

// TODO: add real lazy loading

function useImgState(src?: string) {
  const [dataSrc, setDataSrc] = React.useState(src)

  function ref(image: HTMLImageElement | null) {
    if (!image) {
      return
    }

    const removeDataSrcAttribute = () => {
      setDataSrc(undefined)
    }

    // eslint-disable-next-line no-param-reassign
    image.onload = removeDataSrcAttribute

    if (image.complete && dataSrc) {
      removeDataSrcAttribute()
    }
  }

  return { dataSrc, ref }
}

export default function Avatar({
  src,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { dataSrc, ref } = useImgState(src)

  return <img {...props} ref={ref} src={src} alt={alt} data-src={dataSrc} />
}
