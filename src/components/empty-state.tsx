import React from 'react'
import Message from './message'

export default function EmptyState() {
  return (
    <Message>
      Your search did not match any Github users{' '}
      <span role="img" aria-label="sad">
        😢
      </span>
    </Message>
  )
}
