import React from 'react'
import Link from 'next/link'
import InfiniteScroller from 'react-infinite-scroller'
import { HookError } from '@octokit/rest'
import get from 'lodash.get'
import UserCard from './user-card'
import Loader from './loader'
import ErrorState from './error-state'
import Message from './message'
import { UserSummary, SearchResult } from '../types'

// TODO: add empty state

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

  const dataSource = get(searchResult, 'data', []) as UserSummary[]
  const nextPage = get(searchResult, 'pageInfo.nextPage', 0)

  if (!dataSource.length) {
    return (
      <Message>
        Your search did not match any Github users{' '}
        <span role="img" aria-label="sad">
          😢
        </span>
      </Message>
    )
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
