import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
   * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }
  body {
    background: #fff;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #40A9FF;
    border-radius: 0.25rem;
  }
  @media (max-width: 600px) {
    ::-webkit-scrollbar {
      width: 0.15rem;
      height: 0.15rem;
    }
  }
  body, input, button {
    font: 16px Roboto, Arial, Helvetica, sans-serif;
  }
	button {
    cursor: pointer;
  }
`