import { FC, useMemo, useState } from 'react'
import { Avatar, Divider, Card, message, Modal } from 'antd'
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { parseISO } from 'date-fns'

import { useAuth } from 'hooks/auth'
import { getCurrentDate, createRegister } from 'repositories'

import {
  UserInfos,
  LineInfos,
  RegisterContainer,
  RegisterButton,
} from 'styles/pages'
import { formatCurrentDateTime, formatLastRegister } from 'services/format'

const Home: FC = () => {
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()

  const { currentDate } = getCurrentDate()

  if (!user) return null

  const formattedLastRegister = useMemo(() => {
    if (!user?.lastRegister) return ''

    return formatLastRegister(parseISO(user.lastRegister))
  }, [user?.lastRegister])

  const formattedCurrentDate = useMemo(() => {
    if (!currentDate) return ''

    return formatCurrentDateTime(parseISO(currentDate))
  }, [currentDate])

  const handleRegister = async () => {
    setLoading(true)

    const { success, register } = await createRegister(user._id)

    setLoading(false)

    if (!success) {
      message.error("Wasn't be able to register, please try again")
      return
    }

    Modal.success({
      title: 'Registered with success!',
      content: `Register proof: ${register._id}`,
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
          loading={loading}
        >
          Register
        </RegisterButton>
      </RegisterContainer>
    </>
  )
}

export default Home
