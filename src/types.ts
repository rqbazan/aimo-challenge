export interface User {
  id: string
  nickname: string
  avatarUrl: string
}

export interface PageInfo {
  totalCount: number
  nextPage?: number
  prevPage?: number
}

export interface ApiResult<T> {
  data: T
  pageInfo: PageInfo
}

export interface Query {
  term: string
  page: number
}

export interface GithubUserApi {
  findAll(query: Query): Promise<ApiResult<User[]>>
}
