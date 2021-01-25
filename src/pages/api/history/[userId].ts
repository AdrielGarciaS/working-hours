import {
  compareAsc,
  compareDesc,
  isSameDay,
  parseISO,
  differenceInMinutes,
} from 'date-fns'
import { NextApiHandler } from 'next'

import dbConnect from 'server/utils/dbConnect'
import Register from 'server/models/Register'

interface IBreakData {
  breaks: IBreak[]
  breakMinutes: number
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

        const breakMinutes = differenceInMinutes(
          arrivingFromBreak,
          exitingToBreak,
        )

        const _breaksData: IBreakData = {
          breaks: [...breaksData.breaks, breakData],
          breakMinutes: breaksData.breakMinutes + breakMinutes,
        }

        return _breaksData
      },
      { breakMinutes: 0, breaks: [] } as IBreakData,
    )

    const workedMinutes = allRegistersInDay.reduce(
      (workedMinutes, reg, index) => {
        const isArrivingRegister = index % 2 === 0
        const isLastRegister =
          index > 0 && index + 1 === allRegistersInDay.length

        if (!isArrivingRegister || isLastRegister) return workedMinutes

        const nextRegister = allRegistersInDay[index + 1]

        if (!nextRegister) {
          const workedMinutesUntilNow = differenceInMinutes(
            new Date(),
            reg.date,
          )

          return workedMinutes + workedMinutesUntilNow
        }

        const quantityHours = differenceInMinutes(nextRegister.date, reg.date)

        return workedMinutes + quantityHours
      },
      0,
    )

    const dayHistory: IHistory = {
      arriving: firstRegisterOnDay.date.toISOString(),
      exiting: lastRegisterOnDay?.date?.toISOString() || null,
      date: register.date.toISOString(),
      breaks: breaksData.breaks,
      workedMinutes: workedMinutes - breaksData.breakMinutes,
    }

    const _history = [...history, dayHistory]

    return _history
  }, [] as IHistory[])

  history.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)))

  response.json({ history })
}

export default historyRouter
