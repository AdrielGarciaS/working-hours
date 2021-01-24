import { FC, useMemo } from 'react'
import { Avatar, Divider, Card, message, Modal } from 'antd'
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { format, parseISO } from 'date-fns'

import { useAuth } from '@hooks/auth'
import { getCurrentDate, createRegister } from '@repositories/index'

import {
  UserInfos,
  LineInfos,
  RegisterContainer,
  RegisterButton,
} from '@styles/pages'

const Home: FC = () => {
  const { user } = useAuth()

  const { currentDate } = getCurrentDate()

  if (!user) return null

  const formattedLastRegister = useMemo(() => {
    if (!user?.lastRegister) return ''

    return format(parseISO(user.lastRegister), "dd/MM/yyyy 'at' HH:mm")
  }, [user?.lastRegister])

  const formattedCurrentDate = useMemo(() => {
    if (!currentDate) return ''

    return format(parseISO(currentDate), 'dd/MM HH:mm')
  }, [currentDate])

  const handleRegister = async () => {
    const { success, register } = await createRegister(user._id)

    if (!success) {
      message.error("Wasn't be able to register, please try again")
      return
    }

    Modal.success({
      title: 'Registered with success!',
      content: `Register proof number: ${register._id}`,
    })
  }

  return (
    <>
      <Card bordered>
        <LineInfos>
          <Avatar size={64} icon={<UserOutlined />} />
          <UserInfos>
            <strong>{user.name}</strong>

            <span>{user.position}</span>
          </UserInfos>
        </LineInfos>

        <Divider />

        <LineInfos>
          <strong>Date/Time:</strong>

          <span>{formattedCurrentDate}</span>
        </LineInfos>

        <Divider />

        <LineInfos>
          <strong>Last register:</strong>

          <span>{formattedLastRegister}</span>
        </LineInfos>
      </Card>

      <RegisterContainer>
        <RegisterButton
          type="primary"
          icon={<CheckCircleOutlined style={{ fontSize: 20 }} />}
          size="large"
          onClick={handleRegister}
        >
          Register
        </RegisterButton>
      </RegisterContainer>
    </>
  )
}

export default Home
