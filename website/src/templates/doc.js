import React from 'react'
import { graphql } from 'gatsby'

import Html from 'components/Html'
import Page from 'components/Page'
import Pagination from 'components/Pagination'

import siteConfig from 'siteConfig'

const links = siteConfig.docs.map(item => ({
  key: item.title,
  title: item.title,
  to: item.path,
}))

class DocumentTemplate extends React.Component {
  render() {
    const { data, pageContext, location } = this.props
    const doc = data.markdownRemark
    const link = links.find(link => link.to === pageContext.slug)

    return (
      <Page title={`Docs: ${link.title}`} location={location} links={links}>
        <Html htmlAst={doc.htmlAst} />
        <Pagination links={links} link={link} />
      </Page>
    )
  }
}

export default DocumentTemplate

export const pageQuery = graphql`
  query DocumentBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
    }
  }
`
