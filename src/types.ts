export interface UserSummary {
  id: string
  username: string
  avatarUrl: string
}

export interface UserProfile extends UserSummary {
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
  data: UserSummary[]
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
