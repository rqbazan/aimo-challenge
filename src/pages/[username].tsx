import 'isomorphic-unfetch'
import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import { NextPageContext } from 'next'
import Avatar from '../components/avatar'
import GithubUser from '../github'
import { UserProfile } from '../types'

interface ProfilePageProps {
  profile: UserProfile
}

interface NavItemProps {
  text: string
  emoji: string
  onClick(): void
}

function NavItem({ text, emoji, onClick }: NavItemProps) {
  return (
    <div
      className="flex items-center justify-center p-3 border-2 border-gray-500 hover:border-gray-900 focus:outline-none focus:border-gray-900"
      role="button"
      onClick={onClick}
      onKeyPress={e => e.key === 'Enter' && onClick()}
      tabIndex={0}
    >
      <span role="img" aria-label="back" className="text-1xl">
        {emoji}
      </span>
      <span className="text-sm ml-2 uppercase">{text}</span>
    </div>
  )
}

export default function ProfilePage({ profile }: ProfilePageProps) {
  return (
    <>
      <Head>
        <title>{`@${profile.username}`}</title>
      </Head>
      <div className="flex m-auto max-w-full md:max-w-2xl h-screen">
        <div className="flex flex-col p-4 self-center w-full">
          <div className="flex mb-5 justify-between">
            <NavItem emoji="⬅️" text="Back" onClick={() => Router.back()} />
            <NavItem emoji="🏡" text="Root" onClick={() => Router.push('/')} />
          </div>
          <div className="flex mb-5">
            <Avatar
              src={profile.avatarUrl}
              className="h-20 w-20 border border-gray-500 rounded-sm mr-4"
              style={{ minWidth: '5rem' }}
              alt={profile.name}
            />
            <div className="flex flex-col flex-1">
              <h1 className="flex flex-col font-extrabold leading-tight text-2xl">
                {profile.name}
              </h1>
              <a
                className="text-sm mt-1"
                href={`http://github.com/${profile.username}`}
              >{`@${profile.username}`}</a>
            </div>
          </div>
          <div className="text-xs">
            {profile.bio && <p className="mb-2">{profile.bio}</p>}
            <ul>
              <li className="mb-2">
                <strong className="font-bold">company: </strong>
                <span>{profile.company || 'N/A'}</span>
              </li>
              <li className="mb-2">
                <strong className="font-bold">location: </strong>
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
    </>
  )
}

ProfilePage.getInitialProps = async (ctx: NextPageContext) => {
  const username = ctx.query.username as string
  const profile = await GithubUser.getByUsername(username)

  return { profile }
}
