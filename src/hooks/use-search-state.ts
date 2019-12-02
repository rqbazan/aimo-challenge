import React from 'react'
import { HookError } from '@octokit/rest'
import get from 'lodash.get'
import uniqBy from 'lodash.uniqby'
import { SearchResult, Query } from '../types'
import GithubUser from '../github'

export const actionTypes = {
  SEARCHING: 0,
  FAILED: 1,
  SEARCHED: 2,
  REFETCHED: 3
}

export type Action = [keyof typeof actionTypes, any?]

export interface SearchState {
  isSearching: boolean
  searchResult?: SearchResult
  error?: HookError
}

export interface SearchProps {
  isSearching: boolean
  term?: string
}

function reducer(state: SearchState, action: Action): SearchState {
  const [type, payload] = action

  switch (type) {
    case 'SEARCHING': {
      return {
        isSearching: true
      }
    }
    case 'SEARCHED': {
      return {
        isSearching: false,
        searchResult: payload
      }
    }
    case 'REFETCHED': {
      const { data: newUsers } = payload
      const prevUsers = get(state.searchResult, 'data', [])
      // TODO: remove if github client was fixed
      const data = uniqBy(prevUsers.concat(newUsers), 'id')

      return {
        isSearching: false,
        searchResult: {
          data,
          pageInfo: payload.pageInfo
        }
      }
    }
    case 'FAILED': {
      return {
        isSearching: false,
        error: payload
      }
    }
    default: {
      return state
    }
  }
}

export default function useSearchState({ term, isSearching }: SearchProps) {
  const [state, dispatch] = React.useReducer(reducer, {
    isSearching
  })

  async function refetch(query: Query) {
    try {
      const { promise } = GithubUser.findAll(query)
      dispatch(['REFETCHED', await promise])
    } catch (error) {
      dispatch(['FAILED', error])
    }
  }

  React.useEffect(() => {
    if (!term) {
      return undefined
    }

    const { promise, cancel } = GithubUser.findAll({ term, page: 1 })

    dispatch(['SEARCHING'])
    promise
      .then((result: SearchResult) => dispatch(['SEARCHED', result]))
      .catch(error => dispatch(['FAILED', error]))

    return cancel
  }, [term])

  return { state, refetch }
}
