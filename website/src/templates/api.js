import React from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import Page from 'components/Page'
import Document from 'components/Document'
import Anchor from 'components/Anchor'

import siteConfig from 'siteConfig'

const links = siteConfig.api.map(item => ({
  key: item.title,
  title: item.title,
  to: item.path,
}))

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
`

const Block = styled(Document)`
  font-size: 14px;
  p {
    font-size: 14px;
  }
`

const Prop = styled.div`
  margin: 10px 0 20px 10px;
`

const Name = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 5px;
`

const Tag = styled.span`
  font-size: 12px;
  padding: 1px 6px;
  margin: 0 8px;
  border-radius: 4px;
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

const parseType = type => {
  if (type.name === 'enum') {
    if (typeof type.value === 'string') return type.value
    return type.value.map(x => x.value).join(' | ')
  }
  if (type.name === 'union') {
    return type.value.map(x => x.name).join(' | ')
  }
  return type.name
}

class ApiTemplate extends React.Component {
  render() {
    const { data, location } = this.props
    const metaData = data.componentMetadata
    const methods = metaData.childrenComponentMethodExt
    methods.forEach(method => {
      const signature = method.params
        .map(x => `${x.name}${x.type ? `: ${x.type.name}` : ''}`)
        .join(', ')
      method.signature = `(${signature})`
    })

    return (
      <Page
        title={`API: ${metaData.displayName}`}
        location={location}
        links={links}
      >
        <Title>{metaData.displayName}</Title>
        {metaData.description && (
          <Block html={metaData.description.childMarkdownRemark.html} />
        )}
        <Anchor title="Props" />
        {metaData.props
          .filter(prop => prop.type)
          .map(prop => (
            <Prop key={prop.name}>
              <Name>
                {prop.name}
                <Tag>{parseType(prop.type)}</Tag>
                {prop.defaultValue && (
                  <DefaultValue>
                    default to
                    <Tag>{prop.defaultValue.value}</Tag>
                  </DefaultValue>
                )}
                {prop.required && <Required>required</Required>}
              </Name>
              {prop.description && (
                <Block html={prop.description.childMarkdownRemark.html} />
              )}
            </Prop>
          ))}
        {methods.length > 0 && (
          <React.Fragment>
            <Anchor title="Methods" />
            {methods.map((method, idx) => (
              <Prop key={method.name}>
                <Name>
                  {method.name}
                  <Tag>{method.signature}</Tag>
                </Name>
                <Block html={method.childMarkdownRemark.html} />
              </Prop>
            ))}
          </React.Fragment>
        )}
      </Page>
    )
  }
}

export default ApiTemplate

export const pageQuery = graphql`
  query ApiByName($name: String!) {
    componentMetadata(displayName: { eq: $name }) {
      displayName
      description {
        childMarkdownRemark {
          html
        }
      }
      props {
        name
        type {
          name
          value
          raw
        }
        required
        description {
          childMarkdownRemark {
            html
          }
        }
        defaultValue {
          value
        }
      }
      childrenComponentMethodExt {
        name
        params {
          name
          type {
            name
          }
        }
        childMarkdownRemark {
          html
        }
      }
    }
  }
`
