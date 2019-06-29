import React from 'react'
import styled from 'styled-components'
import Highlight, { Prism } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsDarkPlus'

import CopyButton from './CopyButton'

const Container = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 3px;
`

const Scroll = styled.div`
  overflow: auto;
`

const Pre = styled.pre`
  margin: 0;
  padding: 10px;
  float: left;
`

const CodeBlock = ({ code = '', language = 'jsx', ...rest }) => (
  <Container {...rest} style={theme.plain}>
    <Scroll>
      <Highlight
        code={code.trim()}
        language={language}
        Prism={Prism}
        theme={theme}
      >
        {({ tokens, getLineProps, getTokenProps }) => (
          <Pre>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </Pre>
        )}
      </Highlight>
    </Scroll>
    <CopyButton content={code} />
  </Container>
)

export default CodeBlock
