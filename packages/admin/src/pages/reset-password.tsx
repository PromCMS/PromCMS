import { useGlobalContext } from '@contexts/GlobalContext'
import { SiteLayoutHead } from '@layouts'
import { Loader } from '@components/SiteLoader'
import { NextPage } from '@custom-types'
import { Form } from '@components/pages/ResetPasswordPage'

const ResetPasswordPage: NextPage = () => {
  const { isBooting } = useGlobalContext()

  // Take care of booting phase
  if (isBooting) return <Loader show={isBooting} />

  return <Form />
}

ResetPasswordPage.getLayout = (page) => {
  return (
    <>
      <SiteLayoutHead />
      {page}
    </>
  )
}

export default ResetPasswordPage
