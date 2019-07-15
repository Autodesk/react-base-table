import React from 'react'
import styled from 'styled-components'

import Html from './Html'
import Anchor from './Anchor'

const Prop = styled.div`
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

const Required = styled(Tag)`
  background-color: #182a3d;
  color: #fff;
  margin: 0;
`

const DefaultValue = styled.span`
  color: #819099;
`

const Block = styled(Html)`
  color: #666;
`

const parseType = type => {
  if (!type) return 'unknown'

  if (type.name === 'enum') {
    if (typeof type.value === 'string') return type.value
    return type.value.map(x => x.value).join(' | ')
  }

  if (type.name === 'union') {
    return type.value.map(x => x.name).join(' | ')
  }

  return type.name
}

const Props = ({ title = 'Props', props, ...rest }) => {
  return (
    <div {...rest}>
      <Anchor>{title}</Anchor>
      {Array.isArray(props) &&
        props.map(prop => (
          <Prop key={prop.name} id={`props-${prop.name}`}>
            <Name>
              {prop.name}
              <Tag>{parseType(prop.type)}</Tag>
              {prop.defaultValue && (
                <DefaultValue>
                  defaults to
                  <Tag>{prop.defaultValue.value}</Tag>
                </DefaultValue>
              )}
              {prop.required && <Required>required</Required>}
            </Name>
            {prop.description && (
              <Block htmlAst={prop.description.childMarkdownRemark.htmlAst} />
            )}
          </Prop>
        ))}
    </div>
  )
}

export default Props
