import { FC, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Layout, Menu, Divider } from 'antd'

import { Content } from './styles'
import { getUser } from '@repositories/index'
import { useAuth } from '@hooks/auth'

const { Header, Footer } = Layout

const DefaultLayout: FC = ({ children }) => {
  const { updateUser } = useAuth()
  const router = useRouter()

  const { user } = getUser(1)

  const currentYear = useMemo(() => new Date().getFullYear(), [])

  const selectedMenu = useMemo(() => router.pathname, [router.pathname])

  useEffect(() => {
    if (!user) return

    updateUser(user)
  }, [user])

  return (
    <Layout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedMenu]}
          style={{ fontSize: 16 }}
        >
          <Menu.Item key="/">
            <Link href="/">
              <a>Home</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/history">
            <Link href="/history">
              <a>History</a>
            </Link>
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: '0 50px', marginTop: 32 }}>{children}</Content>

      <Divider />
      <Footer style={{ textAlign: 'center', fontSize: 16 }}>
        ©{currentYear} - Created by Adriel Garcia
      </Footer>
    </Layout>
  )
}

export default DefaultLayout
