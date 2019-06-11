import React from 'react'
import styled from 'styled-components'

import Page from 'components/Page'
import Playground from 'components/Playground'

const Container = styled(Page).attrs({ full: true })`
  max-width: 100%;
  height: 100vh;
`

export default ({ location }) => (
  <Container title="Playground" location={location}>
    <Playground />
  </Container>
)
