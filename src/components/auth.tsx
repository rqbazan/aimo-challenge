import React from 'react'
import { useRouter } from 'next/router'
import { oauthLoginUrl } from '@octokit/oauth-login-url'
import { getAccessToken, clearAccessToken } from '../github'

export interface AuthProps {
  githubClientId: string
}

function logout(e: React.MouseEvent) {
  e.preventDefault()
  clearAccessToken()
  window.location.reload()
}

function Auth({ githubClientId }: AuthProps) {
  const router = useRouter()
  const accessToken = getAccessToken()

  if (accessToken) {
    return (
      <a href="/" onClick={logout}>
        Logout
      </a>
    )
  }

  const { url: loginUrl } = oauthLoginUrl({
    clientId: githubClientId,
    state: btoa(
      `asPath=${router.asPath}; rand=${Math.random()
        .toString(36)
        .substr(2)}`
    )
  })

  return <a href={loginUrl}>Login</a>
}

export default React.memo(Auth)
