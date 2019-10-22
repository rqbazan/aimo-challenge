export interface User {
  key: string
  nickname: string
  avatarUrl: string
}

export interface PageInfo {
  totalCount: number
  nextPageUrl?: string
  prevPageUrl?: string
}

export interface ApiResult<T> {
  data: T
  pageInfo: PageInfo
}

export interface GithubUserApi {
  findAll(query: string): Promise<ApiResult<User[]>>
}
