import { FC } from 'react'
import { Header } from './Header'
import { useGlobalContext } from '@contexts/GlobalContext'
import { Loader } from '../../components/SiteLoader'
import { SiteLayoutHead } from '.'

const SiteLayout: FC = ({ children }) => {
  const { isBooting } = useGlobalContext()

  return (
    <>
      <SiteLayoutHead />

      <Loader show={isBooting} />

      {!isBooting && (
        <div className="flex min-h-screen">
          <Header />
          <main className="relative w-full border-l-2 border-project-border bg-gray-50">
            {children}
          </main>
        </div>
      )}

      {/*<Footer />*/}
    </>
  )
}

export default SiteLayout
