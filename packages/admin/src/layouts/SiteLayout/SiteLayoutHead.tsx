import Head from 'next/head'
import { VFC } from 'react'

export const SiteLayoutHead: VFC = () => {
  return (
    <Head>
      <title>PROM CMS</title>
      <meta name="description" content="Another PROM CMS project" />
      <meta name="robots" content="nofollow,noindex" />
    </Head>
  )
}
