import Octokit from '@octokit/rest'
import parseLinkHeader from 'parse-link-header'
import { GithubUserApi, User, ApiResult, PageInfo, Query } from './types'

function getPageInfo<T extends { total_count: number }>(
  response: Octokit.Response<T>
): PageInfo {
  const pageInfo: PageInfo = {
    totalCount: response.data.total_count
  }

  const links = parseLinkHeader(response.headers.link)

  if (!links) {
    return pageInfo
  }

  pageInfo.nextPage = links.next && Number(links.next.page)
  pageInfo.prevPage = links.prev && Number(links.prev.page)

  return pageInfo
}

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

  async findAll(query: Query): Promise<ApiResult<User[]>> {
    const response = await this.octokit.search.users({
      q: query.term,
      page: query.page,
      // eslint-disable-next-line @typescript-eslint/camelcase
      per_page: 10
    })

    return {
      data: response.data.items.map(item => ({
        id: item.node_id,
        nickname: item.login,
        avatarUrl: item.avatar_url
      })),
      pageInfo: getPageInfo(response)
    }
  }
}

export default GithubUserApiImpl.getInstance()
