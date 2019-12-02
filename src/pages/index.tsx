import React from 'react'
import { NextPageContext } from 'next'
import Head from 'next/head'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import get from 'lodash.get'
import { Users, SearchBar } from '../components'
import config from '../config'
import useSearchState, {
  SearchProps as IndexPageProps
} from '../hooks/use-search-state'

const Auth = dynamic(() => import('../components/auth'), {
  ssr: false
})

export default function IndexPage({ term, isSearching }: IndexPageProps) {
  const { state, refetch } = useSearchState({ term, isSearching })

  return (
    <>
      <Head>
        <title>AIMO Challenge</title>
      </Head>
      <header className="bg-purple-200 fixed w-full shadow-md p-4 z-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl">Github Users</h1>
          <div className="text-sm">
            <Auth githubClientId={config.GITHUB_CLIENT_ID} />
          </div>
        </div>
        <div className="flex flex-col">
          <SearchBar
            defaultValue={term}
            onChange={q => q && Router.push(`/?q=${q}`)}
          />
          <span className="text-xs mt-2">
            {get(state, 'searchResult.pageInfo.totalCount', 0)} results
          </span>
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
