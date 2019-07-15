import React from 'react'
import { graphql } from 'gatsby'

import Page from 'components/Page'
import Html from 'components/Html'
import Props from 'components/Props'
import Methods from 'components/Methods'
import Pagination from 'components/Pagination'

import siteConfig from 'siteConfig'

const links = siteConfig.api.map(item => ({
  key: item.title,
  title: item.title,
  to: item.path,
}))

class ApiTemplate extends React.Component {
  render() {
    const { data, pageContext, location } = this.props
    const metaData = data.componentMetadata
    const methods = metaData.childrenComponentMethodExt
    const name = pageContext.name
    const link = links.find(link => link.to === `/api/${name.toLowerCase()}`)

    return (
      <Page
        title={`API: ${metaData.displayName}`}
        location={location}
        links={links}
      >
        <h1>{metaData.displayName}</h1>
        {metaData.description && (
          <Html htmlAst={metaData.description.childMarkdownRemark.htmlAst} />
        )}
        <Props props={metaData.props} />
        {methods.length > 0 && <Methods methods={methods} />}
        <Pagination links={links} link={link} />
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
          htmlAst
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
            htmlAst
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
          htmlAst
        }
      }
    }
  }
`
