import 'isomorphic-unfetch'
import React from 'react'
import { NextPageContext } from 'next'
import GithubUser from '../github'
import { UserProfile } from '../types'

interface ProfilePageProps {
  profile: UserProfile
}

export default function ProfilePage({ profile }: ProfilePageProps) {
  return (
    <div className="flex m-auto max-w-full md:max-w-2xl h-screen">
      <div className="flex flex-col p-4 self-center">
        <div className="flex">
          <img
            src={profile.avatarUrl}
            className="h-20 w-20 border border-gray-500 rounded-sm mr-4"
            alt={profile.name}
          />
          <div>
            <h1 className="flex flex-col">
              <span className="inline-block font-extrabold leading-tight text-2xl">
                {profile.name}
              </span>
              <span className="inline-block text-sm mt-1">
                <a
                  href={`http://github.com/${profile.username}`}
                >{`@${profile.username}`}</a>
              </span>
            </h1>
          </div>
        </div>
        <div className="mt-5 text-xs">
          <p>{profile.bio}</p>
          <ul className="mt-2">
            <li className="mb-2">
              <span className="font-bold">company: </span>
              <span>{profile.company || 'N/A'}</span>
            </li>
            <li className="mb-2">
              <span className="font-bold">location: </span>
              <span>{profile.location || 'N/A'}</span>
            </li>
            <li className="mb-2">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.blog}>{profile.blog}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

ProfilePage.getInitialProps = async (ctx: NextPageContext) => {
  return {
    profile: await GithubUser.getByUsername(ctx.query.username as string)
  }
}
