import { fireEvent, screen, waitFor } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'

import { render } from 'services/tests'
import { formatCurrentDateTime, formatLastRegister } from 'services/format'
import { getUser, getCurrentDate, createRegister } from 'repositories'

import Home from 'pages/index'
import { parseISO } from 'date-fns'

jest.mock('repositories')

const mockedGetUser = mocked(getUser)
const mockedGetCurrentDate = mocked(getCurrentDate)
const mockedCreateRegister = mocked(createRegister)

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
    }
  },
}))

const mockUser: IUser = {
  _id: 'random-id',
  name: 'Name test',
  position: 'Position test',
  lastRegister: '2021-01-15T11:35:00.000Z',
}

const mockRegister: IRegister = {
  date: '2021-01-24T23:52:10.333Z',
  userId: '600d7991151aef6f8764635e',
  _id: '600e082aeb6bdb3c1235fd00',
}

const now = new Date().toISOString()

describe('Home page', () => {
  console.error = jest.fn()

  const renderHome = () => render(Home)

  const mockGetUser = () => {
    mockedGetUser.mockImplementation(() => ({ user: mockUser }))
  }

  const mockCreateRegister = (success: boolean) => {
    mockedCreateRegister.mockImplementation(async () => {
      if (!success) {
        return {
          success: false,
          register: {} as IRegister,
        }
      }

      return {
        success: true,
        register: mockRegister,
      }
    })
  }

  const mockGetCurrentDate = () => {
    mockedGetCurrentDate.mockImplementation(() => ({ currentDate: now }))
  }

  it('should show user infos', async () => {
    mockGetCurrentDate()
    mockGetUser()

    renderHome()

    expect(await screen.findByText(mockUser.name)).toBeInTheDocument()

    expect(screen.getByText(mockUser.position)).toBeInTheDocument()

    const lastRegister = formatLastRegister(parseISO(mockUser.lastRegister))

    expect(screen.getByText(lastRegister)).toBeInTheDocument()
  })

  it('should show current Date/Time', async () => {
    mockGetCurrentDate()
    mockGetUser()

    renderHome()

    const currentDateTime = formatCurrentDateTime(parseISO(now))

    expect(await screen.findByText(currentDateTime)).toBeInTheDocument()
  })

  it('should be able to do a register and show a success modal', async () => {
    mockGetCurrentDate()
    mockGetUser()
    mockCreateRegister(true)

    renderHome()

    expect(await screen.findByText(mockUser.name)).toBeInTheDocument()

    fireEvent.click(screen.getByText('Register'))

    expect(
      await screen.findByText('Registered with success!'),
    ).toBeInTheDocument()

    expect(
      screen.getByText(`Register proof: ${mockRegister._id}`),
    ).toBeInTheDocument()

    expect(mockedCreateRegister).toHaveBeenCalledWith(mockUser._id)
  })

  it('should close success modal when click on OK button', async () => {
    mockGetCurrentDate()
    mockGetUser()
    mockCreateRegister(true)

    renderHome()

    expect(await screen.findByText(mockUser.name)).toBeInTheDocument()

    fireEvent.click(screen.getByText('Register'))

    expect(
      await screen.findByText('Registered with success!'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByText('OK'))

    await waitFor(() => {
      expect(
        screen.queryByText('Registered with success!'),
      ).not.toBeInTheDocument()
    })
  })

  it('should show an error message when register fails', async () => {
    mockGetCurrentDate()
    mockGetUser()
    mockCreateRegister(false)

    renderHome()

    expect(await screen.findByText(mockUser.name)).toBeInTheDocument()

    fireEvent.click(screen.getByText('Register'))

    expect(
      await screen.findByText("Wasn't be able to register, please try again"),
    ).toBeInTheDocument()
  })
})
