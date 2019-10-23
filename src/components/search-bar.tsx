import React from 'react'
import debounce from 'lodash.debounce'

interface SearchProps {
  onChange(value: string): void
  defaultValue?: string
}

const Search: React.FC<SearchProps> = ({
  defaultValue = '',
  onChange: propOnChange
}) => {
  const [value, setValue] = React.useState(defaultValue)

  const dispatchOnChange = React.useCallback(
    debounce((debouncedValue: string) => {
      propOnChange(debouncedValue)
    }, 500),
    []
  )

  React.useEffect(() => {
    dispatchOnChange(value)
  }, [value])

  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      spellCheck={false}
      className="focus:outline-none border focus:border-indigo-800 py-2 px-4 appearance-none"
      placeholder="Search by username"
    />
  )
}

export default Search
