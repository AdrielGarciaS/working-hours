import { screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'

import { render } from 'services/tests'
import {
  formatExtendedDate,
  formatHourMinuteAmPm,
  formatMinutesToHours,
} from 'services/format'
import { getUser, getHistory } from 'repositories'

import History from 'pages/history'
import { parseISO } from 'date-fns'

jest.mock('repositories')

const mockedGetUser = mocked(getUser)
const mockedGetHistory = mocked(getHistory)

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/history',
      pathname: '/history',
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

const mockHistory: IHistory[] = [
  {
    arriving: '2021-01-24T08:36:44.472Z',
    exiting: '2021-01-24T23:52:10.333Z',
    date: '2021-01-24T08:36:44.472Z',
    breaks: [
      {
        exiting: '2021-01-24T12:36:52.080Z',
        arriving: '2021-01-24T13:40:56.057Z',
      },
      {
        exiting: '2021-01-24T13:40:56.057Z',
        arriving: '2021-01-24T18:42:11.036Z',
      },
    ],
    workedMinutes: 537,
  },
  {
    arriving: '2021-01-23T11:00:40.805Z',
    exiting: '2021-01-23T20:00:08.032Z',
    date: '2021-01-23T11:00:40.805Z',
    breaks: [
      {
        exiting: '2021-01-23T15:00:02.865Z',
        arriving: '2021-01-23T16:00:05.218Z',
      },
    ],
    workedMinutes: 480,
  },
]

describe('History page', () => {
  console.error = jest.fn()

  const renderHistory = () => render(History)

  const mockGetUser = () => {
    mockedGetUser.mockImplementation(() => ({ user: mockUser }))
  }

  const mockGetHistory = (data = mockHistory) => {
    mockedGetHistory.mockImplementation(() => ({
      history: data,
      loading: false,
    }))
  }

  it('should show all data from "Date" column', async () => {
    mockGetHistory()
    mockGetUser()

    renderHistory()

    const firstDateCell = formatExtendedDate(parseISO(mockHistory[0].date))

    expect(await screen.findByText(firstDateCell)).toBeInTheDocument()

    mockHistory.forEach(history => {
      const dateCell = formatExtendedDate(parseISO(history.date))

      expect(screen.getByText(dateCell)).toBeInTheDocument()
    })
  })

  it('should show all data from "Arriving and Exiting" column', async () => {
    mockGetHistory()
    mockGetUser()

    renderHistory()

    const firstArriving = formatHourMinuteAmPm(
      parseISO(mockHistory[0].arriving),
    )

    const firstExiting = formatHourMinuteAmPm(parseISO(mockHistory[0].exiting))

    expect(
      await screen.findByText(`${firstArriving} - ${firstExiting}`),
    ).toBeInTheDocument()

    mockHistory.forEach(history => {
      const arriving = formatHourMinuteAmPm(parseISO(history.arriving))
      const exiting = formatHourMinuteAmPm(parseISO(history.exiting))

      expect(screen.getByText(`${arriving} - ${exiting}`)).toBeInTheDocument()
    })
  })

  it("should show 'Pending' when exiting time doesn't exist", async () => {
    const mockHistoryWithoutExitingTime = mockHistory.map(history => ({
      ...history,
      exiting: null,
    }))

    mockGetHistory(mockHistoryWithoutExitingTime)
    mockGetUser()

    renderHistory()

    const firstArriving = formatHourMinuteAmPm(
      parseISO(mockHistory[0].arriving),
    )

    const firstPendingExit = 'Pending'

    expect(
      await screen.findByText(`${firstArriving} - ${firstPendingExit}`),
    ).toBeInTheDocument()

    mockHistory.forEach(history => {
      const arriving = formatHourMinuteAmPm(parseISO(history.arriving))
      const pendingExit = 'Pending'

      expect(
        screen.getByText(`${arriving} - ${pendingExit}`),
      ).toBeInTheDocument()
    })
  })

  it('should show all data from "Break" column', async () => {
    const formatBreakTimes = (breaks: IBreak[]) => {
      const breakTimes = breaks.map(breakTime => {
        const formattedExiting = formatHourMinuteAmPm(
          parseISO(breakTime.exiting),
        )
        const formattedArriving = formatHourMinuteAmPm(
          parseISO(breakTime.arriving),
        )

        return `${formattedExiting} - ${formattedArriving}`
      })

      return breakTimes.join('; ')
    }

    mockGetHistory()
    mockGetUser()

    renderHistory()

    const firstBreakCell = formatBreakTimes(mockHistory[0].breaks)

    expect(await screen.findByText(firstBreakCell)).toBeInTheDocument()

    mockHistory.forEach(history => {
      const breaksCell = formatBreakTimes(history.breaks)

      expect(screen.getByText(breaksCell)).toBeInTheDocument()
    })
  })

  it('should show all data from "Worked hours" column', async () => {
    mockGetHistory()
    mockGetUser()

    renderHistory()

    const firstWorkedHoursCell = formatMinutesToHours(
      mockHistory[0].workedMinutes,
    )

    expect(await screen.findByText(firstWorkedHoursCell)).toBeInTheDocument()

    mockHistory.forEach(history => {
      const workedHoursCell = formatMinutesToHours(history.workedMinutes)

      expect(screen.getByText(workedHoursCell)).toBeInTheDocument()
    })
  })
})
