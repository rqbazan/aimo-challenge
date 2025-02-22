import React from 'react'
import Link from 'next/link'
import InfiniteScroller from 'react-infinite-scroller'
import { HookError } from '@octokit/rest'
import get from 'lodash.get'
import Message from './message'
import UserCard from './user-card'
import Loader from './loader'
import ErrorState from './error-state'
import EmptyState from './empty-state'
import { UserSummary, SearchResult } from '../types'

interface UsersProps {
  isLoading: boolean
  error?: HookError
  searchResult?: SearchResult
  onScroll(page: number): void
}

const infiniteLoader = (
  <div key="loader" className="flex mb-4 mt-2 w-full">
    <Loader />
  </div>
)

export default function Users(props: UsersProps) {
  const { isLoading, error, searchResult, onScroll } = props

  if (error) {
    return <ErrorState error={error} />
  }

  if (isLoading) {
    return <Loader />
  }

  if (!searchResult) {
    return (
      <Message>
        Everything is ready to you{' '}
        <span role="img" aria-label="searching">
          🕵️
        </span>
      </Message>
    )
  }

  const dataSource = get(searchResult, 'data', []) as UserSummary[]
  const nextPage = get(searchResult, 'pageInfo.nextPage', 0)

  if (!dataSource.length) {
    return <EmptyState />
  }

  return (
    <InfiniteScroller
      className="w-full flex flex-wrap"
      pageStart={1}
      loadMore={() => onScroll(nextPage)}
      hasMore={!!nextPage}
      loader={infiniteLoader}
    >
      {dataSource.map((user: UserSummary) => (
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
    </InfiniteScroller>
  )
}
