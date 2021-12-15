import '../styles/globals.css'
import type { AppProps } from 'next/app'
import SiteLayout from '../layouts/SiteLayout/SiteLayout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SiteLayout>
      <Component {...pageProps} />
    </SiteLayout>
  )
}

export default MyApp
