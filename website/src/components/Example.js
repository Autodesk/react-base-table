import React from 'react'
import styled from 'styled-components'

import ActionPanel from './ActionPanel'

const Container = styled.div`
  h4 {
    color: #819099;
    margin-top: 20px;
  }
`

const Example = ({ component: Component, name, channel }) => {
  return (
    <Container>
      <Component />
      <ActionPanel name={name} channel={channel} />
    </Container>
  )
}

export default Example
