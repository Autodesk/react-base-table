import React from 'react'
import styled from 'styled-components'

import Page from 'components/Page'
import Playground from 'components/Playground'

// eslint-disable-next-line
const code = require('!raw-loader!./example.code')

const Container = styled(Page).attrs({ full: true })`
  max-width: 100%;
  height: 100vh;
`

export default ({ location }) => (
  <Container title="Playground" location={location}>
    <Playground code={code} />
  </Container>
)
