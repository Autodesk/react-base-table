import React from 'react'
import { Redirect } from '@reach/router'
import { withPrefix } from 'gatsby-link'

import Page from 'components/Page'

const Examples = () => (
  <Page title="Examples">
    <Redirect
      from={withPrefix('/examples')}
      to={withPrefix('/examples/default')}
      noThrow
    />
  </Page>
)

export default Examples
