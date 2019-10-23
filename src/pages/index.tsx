import React from 'react'
import debounce from 'lodash.debounce'
import get from 'lodash.get'
import InfiniteScroller from 'react-infinite-scroller'
import Users from '../components/users'
import Loader from '../components/loader'
import { User, ApiResult, Query } from '../types'
import GithubUser from '../github'

interface IndexPageState {
  isSearching: boolean
  query: Query
  searchResult?: ApiResult<User[]>
}

const actionTypes = {
  SEARCHING: 0,
  SCROLLING: 1,
  CLEANED: 2,
  FAILED: 3,
  SEARCHED: 4,
  REFETCHED: 5
}

const initialState: IndexPageState = {
  isSearching: false,
  query: {
    term: '',
    page: 1
  }
}

function reducer(
  state: IndexPageState,
  action: { type: keyof typeof actionTypes; payload?: any }
): IndexPageState {
  const { type, payload } = action

  switch (type) {
    case 'SEARCHING': {
      return {
        isSearching: true,
        query: {
          page: 1,
          term: payload
        }
      }
    }
    case 'SEARCHED': {
      return {
        isSearching: false,
        query: state.query,
        searchResult: payload
      }
    }
    case 'REFETCHED': {
      const prevUsers = get(state, 'searchResult.data', [])

      return {
        isSearching: false,
        query: state.query,
        searchResult: {
          pageInfo: payload.pageInfo,
          data: prevUsers.concat(payload.data)
        }
      }
    }
    case 'FAILED': {
      return {
        isSearching: false,
        query: state.query
      }
    }
    case 'CLEANED': {
      return initialState
    }
    default: {
      return state
    }
  }
}

function useSearchState() {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const search = React.useCallback(
    debounce(async (term: string) => {
      try {
        const result = await GithubUser.findAll({ term, page: 1 })
        dispatch({ type: 'SEARCHED', payload: result })
      } catch (error) {
        dispatch({ type: 'FAILED', payload: error })
      }
    }, 500),
    []
  )

  const refetch = React.useCallback(
    debounce(async (query: Query) => {
      try {
        const result = await GithubUser.findAll(query)
        dispatch({ type: 'REFETCHED', payload: result })
      } catch (error) {
        dispatch({ type: 'FAILED', payload: error })
      }
    }, 500),
    []
  )

  return { state, search, refetch, dispatch }
}

export default function IndexPage() {
  const { state, search, refetch, dispatch } = useSearchState()
  const { query, isSearching, searchResult } = state

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const { value: inputValue } = e.target

    if (inputValue) {
      dispatch({ type: 'SEARCHING', payload: inputValue })
      search(inputValue)
    } else {
      dispatch({ type: 'CLEANED' })
      search.cancel()
      refetch.cancel()
    }
  }

  function onScroll() {
    const nextPage = get(searchResult, 'pageInfo.nextPage')

    if (query.term && nextPage) {
      refetch({ ...query, page: nextPage })
    }
  }

  return (
    <>
      <header className="flex-col items-center bg-purple-200 fixed w-full shadow-md p-4 z-10">
        <h1 className="text-xl mb-2">Github Users</h1>
        <div className="flex flex-col">
          <input
            value={query.term}
            onChange={onSearch}
            className="bg-white focus:outline-none border border-indigo-200 focus:border-indigo-800 py-2 px-4 w-full appearance-none"
            placeholder="Search by username"
          />
          <span className="text-xs mt-2">
            {get(searchResult, 'pageInfo.totalCount', 0)} results
          </span>
        </div>
      </header>
      <InfiniteScroller
        pageStart={1}
        loadMore={onScroll}
        hasMore={!!get(searchResult, 'pageInfo.nextPage')}
        loader={
          <div key="loader" className="flex mb-4 mt-2">
            <Loader />
          </div>
        }
      >
        <div className="flex flex-wrap mx-2 pt-40">
          <Users
            isLoading={isSearching}
            dataSource={get(searchResult, 'data')}
          />
        </div>
      </InfiniteScroller>
    </>
  )
}
