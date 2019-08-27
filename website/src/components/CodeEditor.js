import React, { useState, useCallback, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { CodeEditor as Editor } from 'react-live-runner'
import { debounce } from 'lodash'

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
  font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
  font-size: 1.4rem;
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

const CodeEditor = ({ sourceCode, language, onChange, ...rest }) => {
  const [code, setCode] = useState(sourceCode)
  const debouncedChange = useMemo(() => debounce(onChange, 300), [onChange])
  const handleChange = useCallback(code => {
    setCode(code)
    debouncedChange(code)
  }, [debouncedChange])
  useEffect(() => setCode(sourceCode), [sourceCode])

  return (
    <Container {...rest}>
      <EditorContainer>
        <StyledEditor code={code} language={language} onChange={handleChange} />
      </EditorContainer>
      <CopyButton content={code} />
    </Container>
  )
}

export default CodeEditor
