import React from 'react'
import debounce from 'lodash.debounce'
import GithubUser from '../github'
import UserCard from '../components/user-card'
import { User } from '../types'

export default function IndexPage() {
  const [term, setTerm] = React.useState('')
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(false)

  const searchUsers = React.useCallback(
    debounce(async (query: string) => {
      try {
        const result = await GithubUser.findAll(query)
        setUsers(result.data)
      } finally {
        setLoading(false)
      }
    }, 500),
    []
  )

  function onSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const { value: inputValue } = e.target

    setTerm(inputValue)

    if (inputValue) {
      setLoading(true)
      searchUsers(inputValue)
    } else {
      setUsers([])
    }
  }

  return (
    <div>
      <header className="flex-col items-center p-4 bg-purple-200 mb-3">
        <h1 className="mb-2 text-lg">Github Users</h1>
        <div>
          <input
            value={term}
            onChange={onSearch}
            className="bg-white focus:outline-none border rounded-lg py-2 px-4 w-full appearance-none"
            placeholder="Search a username"
          />
        </div>
      </header>
      {loading ? (
        'Loading...'
      ) : (
        <div className="flex flex-wrap mx-2">
          {users.map(user => (
            <div
              key={user.key}
              className="w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 mb-3 px-2"
            >
              <UserCard
                key={user.key}
                nickname={user.nickname}
                avatarUrl={user.avatarUrl}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
