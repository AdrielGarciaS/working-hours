import { NextApiHandler } from 'next'

const dateRouter: NextApiHandler = async (request, response) => {
  const { method } = request

  if (method !== 'GET') {
    response.status(404)
    return
  }

  const currentDate = new Date().toISOString()

  response.json({ date: currentDate })
}

export default dateRouter
