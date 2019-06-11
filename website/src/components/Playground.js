import React, { useMemo, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useLiveRunner } from 'react-live-runner'
import Editor from './Editor'
import CopyButton from './CopyButton'

import baseScope from 'utils/baseScope'
import { getCode, replaceState } from 'utils/urlHash'

const Container = styled.div`
  display: flex;
  box-shadow: 0 0 8px 0 lightsteelblue;
  height: 100%;
`

const StyledEditor = styled(Editor)`
  flex: 0 1 600px;
`

const PreviewContainer = styled.div`
  flex: 1 1 600px;
  position: relative;
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
  padding: 10px;
  color: #f00;
  white-space: pre;
`

const Playground = ({ scope: _scope, language, type, ...rest }) => {
  const scope = useMemo(() => ({ ...baseScope, ..._scope }), [
    baseScope,
    _scope,
  ])
  const [sourceCode, setSourceCode] = useState('')
  const { element, error, code, onChange } = useLiveRunner({
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

  useEffect(() => {
    setSourceCode(getCode)
  }, [])

  return (
    <Container {...rest}>
      <StyledEditor code={code} language={language} onChange={handleChange} />
      <PreviewContainer>
        {error ? (
          <Error>{error.toString()}</Error>
        ) : (
          <Preview>{element}</Preview>
        )}
        {typeof document !== 'undefined' && (
          <CopyButton text="copy link" content={document.location.href} />
        )}
      </PreviewContainer>
    </Container>
  )
}

export default Playground
