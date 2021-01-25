import { NextApiHandler } from 'next'

import dbConnect from 'server/utils/dbConnect'
import Register from 'server/models/Register'

const registerRouter: NextApiHandler = async (request, response) => {
  const { method, query } = request

  if (method !== 'POST') {
    response.status(404).json({ error: 'Invalid method' })
    return
  }

  if (!query?.userId) {
    response.status(500).json({ error: 'Id is a required parameter.' })
    return
  }

  await dbConnect()

  const { userId } = query

  const register = await Register.create({
    userId,
    date: new Date(),
  })

  response.json({ register })
}

export default registerRouter
