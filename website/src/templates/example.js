import React from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import Anchor from 'components/Anchor'
import Page from 'components/Page'
import CodePreview from 'components/CodePreview'

import siteConfig from 'siteConfig'

const links = siteConfig.examples.map(item => ({
  key: item.title,
  title: item.title,
  to: item.path,
}))

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
`

const Error = styled.div`
  background-color: #dae1e6;
  padding: 12px;
  border-radius: 3.6px;
  color: #ff495c;
`

class ComponentTemplate extends React.Component {
  render() {
    const { data, pageContext, location } = this.props
    const code = data.rawCode.content
    const name = pageContext.name
    const link = links.find(link => link.to === `/examples/${name}`)
    return (
      <Page title={`Examples: ${link.title}`} location={location} links={links}>
        <Title>{link.title}</Title>
        <Anchor title="Example" />
        <CodePreview code={code} />
      </Page>
    )
  }
}

export default ComponentTemplate

export const pageQuery = graphql`
  query ExampleByName($name: String!) {
    rawCode(name: { eq: $name }) {
      content
    }
  }
`
