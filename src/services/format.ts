import { format } from 'date-fns'

export const formatHourMinuteAmPm = (date: Date) => format(date, 'hh:mm aaaa')

export const formatExtendedDate = (date: Date) =>
  format(date, "EEE',' LLL '-' yyyy")

export const formatMinutesToHours = (minutes: number) => {
  const floorMinutes = Math.floor(minutes % 60)
  const floorHours = Math.floor(minutes / 60)

  const formattedHours = String(floorHours).padStart(2, '0')
  const formattedMinutes = String(floorMinutes).padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}`
}

export const formatLastRegister = (date: Date) =>
  format(date, "dd/MM/yyyy 'at' HH:mm")

export const formatCurrentDateTime = (date: Date) => format(date, 'dd/MM HH:mm')
