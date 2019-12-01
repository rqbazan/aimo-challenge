import React from 'react'
import { NextPageContext } from 'next'
import Head from 'next/head'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import get from 'lodash.get'
import uniqBy from 'lodash.uniqby'
import { HookError } from '@octokit/rest'
import { Users, SearchBar } from '../components'
import { SearchResult, Query } from '../types'
import GithubUser from '../github'
import config from '../config'

const Auth = dynamic(() => import('../components/auth'), {
  ssr: false
})

const actionTypes = {
  SEARCHING: 0,
  FAILED: 1,
  SEARCHED: 2,
  REFETCHED: 3
}

interface IndexPageState {
  isSearching: boolean
  searchResult?: SearchResult
  error?: HookError
}

interface IndexPageProps {
  isSearching: boolean
  term?: string
}

type ActionType = keyof typeof actionTypes

type Action = [ActionType, any?]

function reducer(state: IndexPageState, action: Action): IndexPageState {
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

function useSearchState({ term, isSearching }: IndexPageProps) {
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

export default function IndexPage({ term, isSearching }: IndexPageProps) {
  const { state, refetch } = useSearchState({ term, isSearching })

  return (
    <>
      <Head>
        <title>AIMO Challenge</title>
      </Head>
      <header className="bg-purple-200 fixed w-full shadow-md p-4 z-10">
        <h1 className="text-xl mb-2">Github Users</h1>
        <div className="flex flex-col">
          <SearchBar
            defaultValue={term}
            onChange={q => q && Router.push(`/?q=${q}`)}
          />
          <span className="text-xs mt-2">
            {get(state, 'searchResult.pageInfo.totalCount', 0)} results
          </span>
        </div>
        <div className="absolute top-0 right-0 mt-6 mr-4 text-sm">
          <Auth githubClientId={config.GITHUB_CLIENT_ID} />
        </div>
      </header>
      <div className="flex flex-wrap mx-2 pt-40">
        <Users
          isLoading={state.isSearching}
          searchResult={state.searchResult}
          error={state.error}
          onScroll={page => term && refetch({ term, page })}
        />
      </div>
    </>
  )
}

IndexPage.getInitialProps = async (
  ctx: NextPageContext
): Promise<IndexPageProps> => {
  if (!ctx.query.q) {
    return {
      isSearching: false
    }
  }

  return {
    term: ctx.query.q as string,
    isSearching: true
  }
}
