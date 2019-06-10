import React from 'react'
import styled from 'styled-components'
import Highlight, { Prism } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsDarkPlus'

import CopyButton from './CopyButton'

const Container = styled.pre`
  position: relative;
  padding: 10px;
  border-radius: 3px;
  font-size: 16px;
  font-family: monospace;
`

const Code = ({ code, language = 'jsx' }) => (
  <Container style={theme.plain}>
    <Highlight code={code.trim()} language={language} Prism={Prism} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </>
      )}
    </Highlight>
    <CopyButton content={code} />
  </Container>
)

export default Code
