import 'react-lazy-load-image-component/src/effects/opacity.css'
import React from 'react'
import truncate from 'lodash.truncate'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { User } from '../types'

function UserCard({ avatarUrl, username }: User) {
  return (
    <figure className="bg-white flex flex-col justify-center items-center py-6 shadow-md cursor-pointer">
      <LazyLoadImage
        src={avatarUrl}
        alt={username}
        height={56}
        width={56}
        effect="opacity"
        className="rounded-full border-gray-200 border"
      />
      <figcaption className="inline-block text-gray-900 text-xs mt-4">
        {`@${truncate(username, { length: 10 })}`}
      </figcaption>
    </figure>
  )
}

export default React.memo(UserCard)
