export interface User {
  id: string
  username: string
  avatarUrl: string
}

export interface UserProfile extends User {
  bio: string
  name: string
  company: string
  blog: string
  location: string
  email: string
  followers: number
  following: number
  createdAt: string
}

export interface PageInfo {
  totalCount: number
  nextPage?: number
  prevPage?: number
}

export interface SearchResult {
  data: User[]
  pageInfo: PageInfo
}

export interface Query {
  term: string
  page: number
}

export interface GithubUserApi {
  findAll(query: Query): Promise<SearchResult>
  getByUsername(username: string): Promise<UserProfile>
}
