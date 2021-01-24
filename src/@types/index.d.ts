interface IRegister {
  _id: string
  date: string
  userId: string
}

interface IUser {
  _id: string
  name: string
  position: string
  lastRegister: string
}

interface IBreak {
  exiting: string
  arriving: string
}

interface IHistory {
  date: string
  arriving: string
  exiting: string
  breaks: IBreak[]
  workedHours: number
}
