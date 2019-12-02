import React from 'react'
import { HookError } from '@octokit/rest'
import Message from './message'

interface ErrorStateProps {
  error: HookError
}

export default function ErrorState({ error }: ErrorStateProps) {
  const documentation = error.documentation_url && (
    <a href={error.documentation_url} target="_blank" rel="noopener noreferrer">
      More about this issue.
    </a>
  )

  if (error.status === 403) {
    return (
      <Message>
        API rate limit exceeded, but you can log in with Github to increment
        that. {documentation}
      </Message>
    )
  }

  return <Message>A unexpected error occurred. {documentation}</Message>
}
