import React from 'react'
import { graphql } from 'gatsby'

import Document from 'components/Document'
import Page from 'components/Page'

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
        <Document html={doc.html} />
      </Page>
    )
  }
}

export default DocumentTemplate

export const pageQuery = graphql`
  query DocumentBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
    }
  }
`
