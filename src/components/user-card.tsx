import React from 'react'
import truncate from 'lodash.truncate'
import { User } from '../types'

function UserCard(props: User) {
  return (
    <div className="h-32 w-full bg-white flex flex-col rounded-lg justify-center items-center">
      <img
        src={props.avatarUrl}
        alt={props.nickname}
        className="rounded-full w-12 h-12 mb-2"
      />
      <span className="inline-block text-xs font-mono uppercase">
        {truncate(props.nickname, { length: 10 })}
      </span>
    </div>
  )
}

export default React.memo(UserCard)
