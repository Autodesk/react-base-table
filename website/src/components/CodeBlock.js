import React from 'react'
import styled from 'styled-components'
import { CodeBlock as Code } from 'react-live-runner'

import CopyButton from './CopyButton'

const Container = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.3rem;
`

const Scroll = styled.div`
  overflow: auto;
`

const StyledCode = styled(Code)`
  float: left;
  min-width: 100%;
`

const CodeBlock = ({ code = '', language = 'jsx', ...rest }) => (
  <Container {...rest}>
    <Scroll>
      <StyledCode code={code.trim()} language={language} padding={10} noWrap />
    </Scroll>
    <CopyButton content={code} />
  </Container>
)

export default CodeBlock
