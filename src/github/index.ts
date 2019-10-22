import Octokit from '@octokit/rest'
import { GithubUserApi, User, ApiResult } from '../types'

class GithubUserApiImpl implements GithubUserApi {
  octokit: Octokit

  private static instance: GithubUserApi

  private constructor(options?: Octokit.Options) {
    this.octokit = new Octokit(options)
  }

  static getInstance(): GithubUserApi {
    let { instance } = GithubUserApiImpl

    if (!instance) {
      instance = new GithubUserApiImpl({
        auth: '4b067b6ebe8ff60c41582d73d7c24f38ab6c3f97'
      })
    }

    return instance
  }

  async findAll(query: string): Promise<ApiResult<User[]>> {
    const response = await this.octokit.search.users({ q: query })

    return {
      data: response.data.items.map(item => ({
        key: item.node_id,
        nickname: item.login,
        avatarUrl: item.avatar_url
      })),
      pageInfo: {
        totalCount: response.data.total_count
      }
    }
  }
}

export default GithubUserApiImpl.getInstance()
