import styled from 'styled-components'
import { Button } from 'antd'

export const UserInfos = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  margin-left: 24px;
  font-size: 18px;
`

export const LineInfos = styled.div`
  display: flex;
  align-items: center;

  font-size: 16px;

  > strong {
    margin-right: 8px;
  }
`

export const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 32px;
`

export const RegisterButton = styled(Button)`
  width: 150px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    margin-right: auto;
  }
`
