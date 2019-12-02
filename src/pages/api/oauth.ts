/* eslint @typescript-eslint/camelcase: off */
import 'isomorphic-unfetch'
import { NowRequest, NowResponse } from '@now/node'
import cookie from 'cookie'
import config from '../../config'

const GITHUB_URL = 'https://github.com/login/oauth/access_token'

function getAsPath(state: string) {
  const decoded = Buffer.from(state, 'base64').toString()
  const { asPath } = cookie.parse(decoded)

  return asPath
}

export default async (req: NowRequest, res: NowResponse) => {
  const options = {
    client_id: config.GITHUB_CLIENT_ID,
    client_secret: config.GITHUB_CLIENT_SECRET,
    code: req.query.code,
    state: req.query.state
  }

  const params = Object.keys(options)
    .map(key => `${key}=${options[key as keyof typeof options]}`)
    .join('&')

  try {
    const data = await fetch(`${GITHUB_URL}?${params}`, {
      method: 'POST',
      headers: {
        accept: 'application/json'
      }
    }).then(r => r.json())

    const asPath = getAsPath(req.query.state as string)

    res.writeHead(302, {
      'Set-Cookie': `${config.COOKIE_NAME}=${data.access_token}; path=/`,
      Location: asPath
    })
  } catch (error) {
    console.log(error)
    res.writeHead(500, { Location: '/' })
  } finally {
    res.end()
  }
}
