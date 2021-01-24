import { format } from 'date-fns'

export const formatHourMinute = (date: Date) => format(date, 'hh:mm aaaa')

export const formatExtendedDate = (date: Date) =>
  format(date, "EEE ', ' LLL ' - ' yyyy")

export const formatNumberToHours = (hours: number) => {
  const minutes = Math.floor((hours * 60) % 60)
  const floorHours = Math.floor(hours)

  const formattedHours = String(floorHours).padStart(2, '0')
  const formattedMinutes = String(minutes).padEnd(2, '0')

  return `${formattedHours}:${formattedMinutes}`
}
