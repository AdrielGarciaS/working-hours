import {
  compareAsc,
  compareDesc,
  isSameDay,
  parseISO,
  differenceInHours,
} from 'date-fns'
import { NextApiHandler } from 'next'

import dbConnect from '@server/utils/dbConnect'
import Register from '@server/models/Register'

interface IBreakData {
  breaks: IBreak[]
  breakHours: number
}

const historyRouter: NextApiHandler = async (request, response) => {
  const { method, query } = request

  if (method !== 'GET') {
    response.status(404)
    return
  }

  if (!query?.userId) {
    response.status(500).json({ error: 'Id is a required parameter.' })
    return
  }

  await dbConnect()

  const { userId } = query

  const registers = await Register.find({ userId: String(userId) })

  const registerDates = registers.map(register => {
    const registerData = register.toObject()

    return {
      ...registerData,
      date: new Date(registerData.date),
    }
  })

  registerDates.sort((a, b) => compareAsc(a.date, b.date))

  const history: IHistory[] = registerDates.reduce((history, register) => {
    const dayAlreadyInHistory = history.find(hist =>
      isSameDay(parseISO(hist.date), register.date),
    )

    if (dayAlreadyInHistory) return history

    const allRegistersInDay = registerDates.filter(reg =>
      isSameDay(reg.date, register.date),
    )

    const registers = [...allRegistersInDay]

    const firstRegisterOnDay = registers.shift()
    const lastRegisterOnDay = registers.pop()

    const breaksData: IBreakData = registers.reduce(
      (breaksData, reg, index) => {
        if (!registers[index + 1]) return breaksData

        const exitingToBreak = reg.date
        const arrivingFromBreak = registers[index + 1].date

        const breakData: IBreak = {
          exiting: exitingToBreak.toISOString(),
          arriving: arrivingFromBreak.toISOString(),
        }

        const breakHours = differenceInHours(arrivingFromBreak, exitingToBreak)

        const _breaksData: IBreakData = {
          breaks: [...breaksData.breaks, breakData],
          breakHours: breaksData.breakHours + breakHours,
        }

        return _breaksData
      },
      { breakHours: 0, breaks: [] } as IBreakData,
    )

    const workedHours = allRegistersInDay.reduce((workedHours, reg, index) => {
      const isArrivingRegister = index % 2 === 0
      const isLastRegister = index > 0 && index + 1 === allRegistersInDay.length

      if (!isArrivingRegister || isLastRegister) return workedHours

      const nextRegister = allRegistersInDay[index + 1]

      if (!nextRegister) {
        const workedHoursUntilNow = differenceInHours(new Date(), reg.date) + 1

        return workedHours + workedHoursUntilNow
      }

      const quantityHours = differenceInHours(nextRegister.date, reg.date) + 1

      return workedHours + quantityHours
    }, 0)

    const dayHistory: IHistory = {
      arriving: firstRegisterOnDay.date.toISOString(),
      exiting: lastRegisterOnDay?.date?.toISOString() || null,
      date: register.date.toISOString(),
      breaks: breaksData.breaks,
      workedHours: workedHours - breaksData.breakHours,
    }

    const _history = [...history, dayHistory]

    return _history
  }, [] as IHistory[])

  history.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)))

  response.json({ history })
}

export default historyRouter
