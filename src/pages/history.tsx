import { FC, useMemo } from 'react'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { getHistory } from '@repositories/index'
import { parseISO } from 'date-fns'
import {
  formatExtendedDate,
  formatHourMinute,
  formatNumberToHours,
} from '@services/format'
import { useAuth } from '@hooks/auth'

const columns: ColumnsType = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Arriving and Exiting ',
    dataIndex: 'arrivingExiting',
    key: 'arrivingExiting',
  },
  {
    title: 'Break',
    dataIndex: 'break',
    key: 'break',
  },
  {
    title: 'Worked hours',
    dataIndex: 'workedHours',
    key: 'workedHours',
  },
]

const History: FC = () => {
  const { user } = useAuth()

  const { history } = getHistory(user._id)

  const formattedHistory = useMemo(
    () =>
      history.map(history => {
        const formattedBreaks = history.breaks.map(data => {
          const formattedExiting = formatHourMinute(parseISO(data.exiting))
          const formattedArriving = formatHourMinute(parseISO(data.arriving))

          return `${formattedExiting} - ${formattedArriving}`
        })

        const breaks = formattedBreaks.join('; ')

        const formattedArriving = formatHourMinute(parseISO(history.arriving))
        const formattedExiting = history.exiting
          ? formatHourMinute(parseISO(history.exiting))
          : 'Pending'

        return {
          date: formatExtendedDate(parseISO(history.date)),
          arrivingExiting: `${formattedArriving} - ${formattedExiting}`,
          break: breaks,
          workedHours: formatNumberToHours(history.workedHours),
        }
      }),
    [history],
  )

  return <Table columns={columns} dataSource={formattedHistory} />
}

export default History
