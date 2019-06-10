import React from 'react'
import styled from 'styled-components'
import { CodeEditor } from 'react-live-runner'

import CopyButton from './CopyButton'

const Container = styled.div`
  position: relative;
  overflow: hidden;
`

const EditorContainer = styled.div`
  overflow: auto;
  height: 100%;
`

const StyledEditor = styled(CodeEditor)`
  white-space: pre;
  background: #222;
  caret-color: #fff;
  min-width: 100%;
  min-height: 100%;
  float: left;
  font-size: 16px;

  & > textarea,
  & > pre {
    outline: none;
    white-space: pre !important;
  }
`

const Editor = ({ code, language, onChange, ...rest }) => (
  <Container {...rest}>
    <EditorContainer>
      <StyledEditor code={code} language={language} onChange={onChange} />
    </EditorContainer>
    <CopyButton content={code} />
  </Container>
)

export default Editor
