import React from 'react'
import UserCard from './user-card'
import Loader from './loader'
import { User } from '../types'

// TODO: add empty state
// TODO: add error state

interface UsersProps {
  isLoading: boolean
  dataSource?: User[]
}

export default function Users({ isLoading, dataSource }: UsersProps) {
  if (isLoading) {
    return <Loader />
  }

  if (!dataSource || !dataSource.length) {
    return null
  }

  return (
    <>
      {dataSource.map(user => (
        <div key={user.id} className="w-1/3 md:w-1/4 lg:w-1/6 mb-3 px-2">
          <UserCard
            id={user.id}
            nickname={user.nickname}
            avatarUrl={user.avatarUrl}
          />
        </div>
      ))}
    </>
  )
}
