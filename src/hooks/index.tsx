import { FC } from 'react'

import { AuthProvider } from './auth'

const Providers: FC = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>
}

export default Providers
