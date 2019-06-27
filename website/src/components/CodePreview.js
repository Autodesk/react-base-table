import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useLiveRunner } from 'react-live-runner'

import ActionPanel from './ActionPanel'
import CodeEditor from './CodeEditor'
import { createActionChannel } from 'utils/actionChannel'
import baseScope from 'utils/baseScope'

const Container = styled.div`
  height: 100%;
`

const StyledEditor = styled(CodeEditor)`
  height: 300px;
  border-radius: 3px;
`

const PreviewContainer = styled.div`
  min-height: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 0 8px 0 lightsteelblue;
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
  white-space: pre-wrap;
`

const CodePreview = ({
  code: sourceCode,
  scope: _scope,
  language,
  type,
  ...rest
}) => {
  const { action, channel } = useMemo(createActionChannel, [])
  const scope = useMemo(() => ({ ...baseScope, action, ..._scope }), [
    baseScope,
    action,
    _scope,
  ])
  const { element, error, code, onChange } = useLiveRunner({
    sourceCode,
    scope,
    type,
  })

  return (
    <Container {...rest}>
      <PreviewContainer>
        {error && <Error>{error.toString()}</Error>}
        <Preview>{element}</Preview>
      </PreviewContainer>
      <ActionPanel channel={channel} />
      <StyledEditor code={code} language={language} onChange={onChange} />
    </Container>
  )
}

export default CodePreview
