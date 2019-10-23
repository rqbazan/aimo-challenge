import React from 'react'
import Link from 'next/link'
import UserCard from './user-card'
import Loader from './loader'
import { UserSummary } from '../types'

// TODO: add empty state
// TODO: add error state

interface UsersProps {
  isLoading: boolean
  dataSource?: UserSummary[]
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
        <Link key={user.id} href="/[username]" as={`/${user.username}`}>
          <div className="w-1/3 md:w-1/4 lg:w-1/6 mb-3 px-2">
            <UserCard
              id={user.id}
              username={user.username}
              avatarUrl={user.avatarUrl}
            />
          </div>
        </Link>
      ))}
    </>
  )
}
