import { FC } from 'react'
import { render as renderTestingLibrary } from '@testing-library/react'

import Providers from 'hooks'
import DefaultLayout from 'components/DefaultLayout'

export const render = (Component: FC) => {
  return renderTestingLibrary(
    <DefaultLayout>
      <Component />
    </DefaultLayout>,
    { wrapper: Providers },
  )
}
