import React, { useMemo, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useLiveRunner } from 'react-live-runner'
import CodeEditor from './CodeEditor'
import CopyButton from './CopyButton'

import baseScope from 'utils/baseScope'
import { getCode, replaceState } from 'utils/urlHash'

const Container = styled.div`
  position: relative;
  display: flex;
  box-shadow: 0 0 8px 0 lightsteelblue;
  height: 100%;
`

const StyledEditor = styled(CodeEditor)`
  flex: 0 1 60rem;
`

const PreviewContainer = styled.div`
  position: relative;
  flex: 1 1 60rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f3f3;
  overflow: auto;
  background: #fff;
`

const Preview = styled.div`
  margin: auto;
`

const Error = styled.div`
  background: #fcc;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  margin: 0;
  padding: 1rem;
  color: #f00;
  white-space: pre-wrap;
`

const Playground = ({ scope: _scope, language, type, ...rest }) => {
  const scope = useMemo(() => ({ ...baseScope, ..._scope }), [_scope])
  const [sourceCode, setSourceCode] = useState(getCode)
  const { element, error, onChange } = useLiveRunner({
    sourceCode,
    scope,
    type,
  })
  const handleChange = useCallback(
    code => {
      onChange(code)
      replaceState(code)
    },
    [onChange]
  )

  const canUseDOM = typeof document !== 'undefined'
  useEffect(() => {
    setSourceCode(getCode)
  }, [canUseDOM])

  return (
    <Container {...rest}>
      <StyledEditor
        sourceCode={sourceCode}
        language={language}
        onChange={handleChange}
      />
      <PreviewContainer>
        {error && <Error>{error}</Error>}
        <Preview>{element}</Preview>
      </PreviewContainer>
      {typeof document !== 'undefined' && (
        <CopyButton text="copy link" content={document.location.href} />
      )}
    </Container>
  )
}

export default Playground
