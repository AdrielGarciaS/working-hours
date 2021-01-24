import { createContext, useState, useContext, FC } from 'react'

interface AuthContextData {
  user: IUser
  updateUser(data: IUser): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider: FC = ({ children }) => {
  const [user, setUser] = useState({} as IUser)

  const updateUser = (data: IUser) => {
    setUser(data)
  }

  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }
