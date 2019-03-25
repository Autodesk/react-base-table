import React from 'react'
import { Redirect } from '@reach/router'
import { withPrefix } from 'gatsby-link'

import Page from 'components/Page'

const API = () => (
  <Page title="API">
    <Redirect
      from={withPrefix('/api')}
      to={withPrefix('/api/basetable')}
      noThrow
    />
  </Page>
)

export default API
