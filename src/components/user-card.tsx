import React from 'react'
import truncate from 'lodash.truncate'
import { UserSummary } from '../types'

// TODO: add lazy loading for images

interface AvatarProps {
  src: string
  alt: string
}

function Avatar({ src, alt }: AvatarProps) {
  const [dataSrc, setDataSrc] = React.useState<string | null>(src)

  return (
    <img
      src={src}
      data-src={dataSrc}
      alt={alt}
      style={{ minHeight: 56 }}
      height={56}
      width={56}
      className="rounded-full border-gray-200 border"
      onLoad={() => setDataSrc(null)}
    />
  )
}

function UserCard({ avatarUrl, username, id }: UserSummary) {
  return (
    <figure
      id={id}
      className="bg-white flex flex-col justify-center items-center py-6 shadow-md cursor-pointer"
    >
      <Avatar src={avatarUrl} alt={username} />
      <figcaption className="inline-block text-gray-900 text-xs mt-4">
        {`@${truncate(username, { length: 10 })}`}
      </figcaption>
    </figure>
  )
}

export default React.memo(UserCard)
