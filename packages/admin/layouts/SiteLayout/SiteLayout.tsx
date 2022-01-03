import { FC } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import Head from 'next/head'

const SiteLayout: FC = ({ children }) => {
  return (
    <>
      <Head>
        <title>PROM</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default SiteLayout