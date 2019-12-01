import React from 'react'
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

function getLoginUrl(clientId: string) {
  return oauthLoginUrl({ clientId }).url
}

export default React.memo(function Auth({ githubClientId }: AuthProps) {
  const accessToken = getAccessToken()

  if (accessToken) {
    return (
      <a href="/" onClick={logout}>
        Logout
      </a>
    )
  }

  const loginUrl = getLoginUrl(githubClientId)

  return <a href={loginUrl}>Login</a>
})
