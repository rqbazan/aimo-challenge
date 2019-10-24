import Octokit from '@octokit/rest'
import get from 'lodash.get'
import parseLinkHeader from 'parse-link-header'
import {
  GithubUserApi,
  SearchResult,
  PageInfo,
  Query,
  Cancelable,
  UserProfile
} from './types'

function getPageInfo<T extends { total_count: number }>(
  response: Octokit.Response<T>
): PageInfo {
  const links = parseLinkHeader(response.headers.link)

  return {
    totalCount: response.data.total_count,
    nextPage: Number(get(links, 'next.page', 0)),
    prevPage: Number(get(links, 'next.page', 0))
  }
}

function createCancelable<T>(
  fn: (controller: AbortController) => Promise<T>
): Cancelable<T> {
  const controller = new AbortController()

  return {
    promise: new Promise((res, rej) => fn(controller).then(res, rej)),
    cancel: () => controller.abort()
  }
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

  findAll = (query: Query): Cancelable<SearchResult> => {
    const executor = async (controller: AbortController) => {
      // FIXME: duplicated items in two successive pages
      const response = await this.octokit.search.users({
        // eslint-disable-next-line @typescript-eslint/camelcase
        per_page: 10,
        q: query.term,
        page: query.page,
        request: {
          signal: controller.signal
        }
      })

      return {
        data: response.data.items.map(item => ({
          id: item.node_id,
          username: item.login,
          avatarUrl: item.avatar_url
        })),
        pageInfo: getPageInfo(response)
      }
    }

    return createCancelable(executor)
  }

  getByUsername = (username: string): Cancelable<UserProfile> => {
    const executor = async (controller: AbortController) => {
      const { data } = await this.octokit.users.getByUsername({
        username,
        request: {
          signal: controller.signal
        }
      })

      return {
        id: data.node_id,
        username: data.login,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        name: data.name,
        company: data.company,
        blog: data.blog,
        location: data.location,
        email: data.email,
        followers: data.followers,
        following: data.following,
        createdAt: data.created_at
      }
    }

    return createCancelable(executor)
  }
}

export default GithubUserApiImpl.getInstance()
