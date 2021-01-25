import { compareAsc } from 'date-fns'
import { NextApiHandler } from 'next'

import dbConnect from 'server/utils/dbConnect'
import User from 'server/models/User'
import Register from 'server/models/Register'

const userRouter: NextApiHandler = async (request, response) => {
  const { method } = request

  if (method !== 'GET') {
    response.status(404)
    return
  }

  await dbConnect()

  const user = await User.findOne()

  const registers = await Register.find({ userId: String(user._id) })

  const dates = registers.map(register => new Date(register.date))

  dates.sort(compareAsc)

  const lastRegister = dates[0]

  const userResponse = {
    ...user.toObject(),
    lastRegister,
  }

  response.json({ user: userResponse })
}

export default userRouter
