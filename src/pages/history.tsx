import { FC, useMemo } from 'react'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { getHistory } from 'repositories'
import { parseISO } from 'date-fns'
import {
  formatExtendedDate,
  formatHourMinuteAmPm,
  formatMinutesToHours,
} from 'services/format'
import { useAuth } from 'hooks/auth'

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

  const { history, loading } = getHistory(user._id)

  const formattedHistory = useMemo(
    () =>
      history.map(history => {
        const formattedBreaks = history.breaks.map(data => {
          const formattedExiting = formatHourMinuteAmPm(parseISO(data.exiting))
          const formattedArriving = formatHourMinuteAmPm(
            parseISO(data.arriving),
          )

          return `${formattedExiting} - ${formattedArriving}`
        })

        const breaks = formattedBreaks.join('; ')

        const formattedArriving = formatHourMinuteAmPm(
          parseISO(history.arriving),
        )
        const formattedExiting = history.exiting
          ? formatHourMinuteAmPm(parseISO(history.exiting))
          : 'Pending'

        return {
          date: formatExtendedDate(parseISO(history.date)),
          arrivingExiting: `${formattedArriving} - ${formattedExiting}`,
          break: breaks,
          workedHours: formatMinutesToHours(history.workedMinutes),
        }
      }),
    [history],
  )

  return (
    <Table
      columns={columns}
      dataSource={formattedHistory}
      pagination={false}
      loading={loading}
    />
  )
}

export default History
