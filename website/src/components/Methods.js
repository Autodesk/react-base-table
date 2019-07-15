import React from 'react'
import styled from 'styled-components'

import Html from './Html'
import Anchor from './Anchor'

const Method = styled.div`
  margin-bottom: 1.6rem;
`

const Name = styled.div`
  font-weight: 600;
`

const Tag = styled.span`
  font-size: 0.8em;
  padding: 0.1em 0.4em;
  margin: 0 0.4em;
  border-radius: 0.2em;
  background-color: #daf0f9;
  color: #819099;
`

const Block = styled(Html)`
  color: #666;
`

const getSignature = params =>
  `(${params
    .map(x => `${x.name}${x.type ? `: ${x.type.name}` : ''}`)
    .join(', ')})`

const Methods = ({ title = 'Methods', methods, ...rest }) => (
  <div {...rest}>
    <Anchor>{title}</Anchor>
    {Array.isArray(methods) &&
      methods.map((method, idx) => (
        <Method key={method.name} id={`methods-${method.name}`}>
          <Name>
            {method.name}
            <Tag>{getSignature(method.params)}</Tag>
          </Name>
          <Block htmlAst={method.childMarkdownRemark.htmlAst} />
        </Method>
      ))}
  </div>
)

export default Methods
