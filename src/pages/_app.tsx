import 'antd/dist/antd.css'
import { FC } from 'react'

import GlobalStyle from '@styles/GlobalStyle'
import DefaultLayout from '@components/DefaultLayout'

import Providers from '@hooks/index'

interface IMyAppProps {
  Component: FC
  pageProps: Record<string, unknown>
}

const MyApp: FC<IMyAppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />

      <Providers>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </Providers>
    </>
  )
}

export default MyApp
