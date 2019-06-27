import React from 'react'
import styled from 'styled-components'
import { CodeEditor as Editor } from 'react-live-runner'

import CopyButton from './CopyButton'

const Container = styled.div`
  position: relative;
  overflow: hidden;
`

const EditorContainer = styled.div`
  overflow: auto;
  height: 100%;
`

const StyledEditor = styled(Editor)`
  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace !important;
  font-size: 13px;
  white-space: pre;
  background: #222;
  caret-color: #fff;
  min-width: 100%;
  min-height: 100%;
  float: left;

  & > textarea,
  & > pre {
    outline: none;
    white-space: pre !important;
  }
`

const CodeEditor = ({ code, language, onChange, ...rest }) => (
  <Container {...rest}>
    <EditorContainer>
      <StyledEditor code={code} language={language} onChange={onChange} />
    </EditorContainer>
    <CopyButton content={code} />
  </Container>
)

export default CodeEditor
