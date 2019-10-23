import 'isomorphic-unfetch'
import React from 'react'
import { NextPageContext } from 'next'
import GithubUser from '../github'
import { UserProfile } from '../types'

interface ProfilePageProps {
  profile: UserProfile
}

export default function ProfilePage(props: ProfilePageProps) {
  return null
}

ProfilePage.getInitialProps = async (ctx: NextPageContext) => {
  return {
    profile: await GithubUser.getByUsername(ctx.query.username as string)
  }
}
