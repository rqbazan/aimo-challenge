import 'react-lazy-load-image-component/src/effects/opacity.css'
import React from 'react'
import truncate from 'lodash.truncate'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { User } from '../types'

function UserCard({ avatarUrl, nickname, id }: User) {
  return (
    <figure
      id={id}
      className="bg-white flex flex-col justify-center items-center py-6 shadow-md"
    >
      <LazyLoadImage
        src={avatarUrl}
        alt={nickname}
        height={56}
        width={56}
        effect="opacity"
        className="rounded-full border-gray-200 border"
      />
      <figcaption className="inline-block text-gray-900 text-xs mt-4">
        {`@${truncate(nickname, { length: 10 })}`}
      </figcaption>
    </figure>
  )
}

export default React.memo(UserCard)
