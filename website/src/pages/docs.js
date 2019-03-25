import React from 'react'
import { Redirect } from '@reach/router'
import { withPrefix } from 'gatsby-link'

import Page from 'components/Page'

const Docs = () => (
  <Page title="Docs">
    <Redirect
      from={withPrefix('/docs')}
      to={withPrefix('/docs/get-started')}
      noThrow
    />
  </Page>
)

export default Docs
