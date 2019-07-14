import React from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import Page from 'components/Page'
import CodePreview from 'components/CodePreview'
import Pagination from 'components/Pagination'

import siteConfig from 'siteConfig'

const links = siteConfig.examples.map(item => ({
  key: item.title,
  title: item.title,
  to: item.path,
}))

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin: 16px 0;
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
        <CodePreview code={code} />
        <Pagination links={links} link={link} />
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
