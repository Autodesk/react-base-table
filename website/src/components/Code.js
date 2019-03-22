import React from 'react'
import styled from 'styled-components'

import CopyButton from './CopyButton'

import highlight from 'utils/highlight'

const Container = styled.div`
  position: relative;
`

const Code = ({ code, language = 'jsx' }) => (
  <Container>
    <pre className={`language-${language}`}>
      <code
        dangerouslySetInnerHTML={{
          __html: highlight(code, language),
        }}
      />
    </pre>
    <CopyButton content={code} />
  </Container>
)

export default Code
