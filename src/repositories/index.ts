import useSWR from 'swr'
import api from '@services/api'

interface IGetUserResponse {
  data: {
    user: IUser
  }
}

export const getUser = () => {
  const { data, isValidating } = useSWR<IGetUserResponse>('user', api.get)

  if (!data?.data || isValidating) return {}

  const { user } = data.data

  return { user }
}

interface IGetCurrentDateResponse {
  data: {
    date: string
  }
}

export const getCurrentDate = () => {
  const oneMinute = 1000 * 60

  const { data, isValidating } = useSWR<IGetCurrentDateResponse>(
    'date',
    api.get,
    {
      refreshInterval: oneMinute,
    },
  )

  if (!data?.data || isValidating) return {}

  const { date } = data.data

  return { currentDate: date }
}

interface ICreateRegisterResponse {
  register: IRegister
}

export const createRegister = async (
  userId: string,
): Promise<{ success: boolean; register: IRegister }> => {
  const response = await api.post<ICreateRegisterResponse>(`register/${userId}`)

  if (!response.data.register)
    return { success: false, register: {} as IRegister }

  const { register } = response.data

  return { success: true, register }
}

interface IGetHistoryResponse {
  data: {
    history: IHistory[]
  }
}

export const getHistory = (id: string) => {
  const { data, isValidating } = useSWR<IGetHistoryResponse>(
    `history/${id}`,
    api.get,
  )

  if (!data?.data || isValidating) return { history: [] as IHistory[] }

  const { history } = data.data

  return { history }
}
