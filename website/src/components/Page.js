import React from 'react'
import Helmet from 'react-helmet'
import styled, { css } from 'styled-components'
import { StaticQuery, graphql } from 'gatsby'

import Header from './Header'
import Sidebar from './Sidebar'

import '../styles/index.css'
import 'react-base-table/styles.css'

const pageMixin = css`
  margin: 0 auto;
  max-width: 100rem;
`

const Container = styled.div`
  position: relative;
  padding: 70px 20px 20px;
  ${props => !props.full && pageMixin};
`

const Content = styled.div`
  margin-left: 240px;
`

const Page = ({ title, location = {}, children, links, ...rest }) => (
  <StaticQuery
    query={detailsQuery}
    render={({ site }) => (
      <React.Fragment>
        <Helmet
          title={title || site.config.title}
          titleTemplate={`%s | ${site.config.title}`}
          meta={[
            { name: 'description', content: site.config.description },
            { name: 'keywords', content: site.config.keywords },
            { name: 'author', content: site.config.author },
          ]}
        />
        <Header pathname={location.pathname} />
        <Container {...rest}>
          {links ? (
            <React.Fragment>
              <Sidebar links={links} />
              <Content>{children}</Content>
            </React.Fragment>
          ) : (
            children
          )}
        </Container>
      </React.Fragment>
    )}
  />
)

export default Page

const detailsQuery = graphql`
  query {
    site {
      config: siteMetadata {
        title
        description
        keywords
        author
      }
    }
  }
`
