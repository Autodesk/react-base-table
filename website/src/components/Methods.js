import React from 'react'
import styled from 'styled-components'

import Html from './Html'
import Anchor from './Anchor'

const Method = styled.div`
  margin-bottom: 15px;
`

const Name = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
`

const Tag = styled.span`
  font-size: 12px;
  padding: 2px 6px;
  margin: 0 8px;
  border-radius: 4px;
  background-color: #daf0f9;
  color: #819099;
`

const Block = styled(Html)`
  font-size: 14px;

  p {
    font-size: 14px;
    margin: 0 0 10px;
  }
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
        <Method key={method.name}>
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
