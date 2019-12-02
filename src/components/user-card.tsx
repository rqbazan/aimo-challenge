import React from 'react'
import Avatar from './avatar'
import { UserSummary } from '../types'

function UserCard({ avatarUrl, username, id }: UserSummary) {
  return (
    <figure
      id={id}
      className="bg-white flex flex-col justify-center items-center py-6 shadow-md cursor-pointer"
    >
      <Avatar
        src={avatarUrl}
        alt={username}
        style={{ minHeight: 56 }}
        height={56}
        width={56}
        className="rounded-full border-gray-200 border"
      />
      <figcaption className="inline-block text-gray-900 text-xs mt-4 truncate w-full px-3 text-center">
        {`@${username}`}
      </figcaption>
    </figure>
  )
}

export default React.memo(UserCard)
