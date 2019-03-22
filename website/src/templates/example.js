import React from 'react'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import Anchor from 'components/Anchor'
import Example from 'components/Example'
import Code from 'components/Code'
import Page from 'components/Page'

import ActionChannel from 'utils/actionChannel'

import siteConfig from 'siteConfig'

const context = require.context('../examples', false, /^\.\/(?!index).*\.js$/)

const Examples = context.keys().reduce((modules, fileName) => {
  const exportName = fileName.replace('./', '').replace('.js', '')
  modules[exportName] = context(fileName).default
  return modules
}, {})

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
  state = {
    actionChannel: new ActionChannel(this.props.pageContext.name),
    error: null,
  }

  componentDidCatch(error) {
    this.setState({ error })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pageContext.name !== this.props.pageContext.name) {
      this.setState({
        actionChannel: new ActionChannel(nextProps.pageContext.name),
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.pageContext.name !== this.props.pageContext.name
  }

  render() {
    const { data, pageContext, location } = this.props
    const { actionChannel, error } = this.state
    const code = data.rawCode.content
    const name = pageContext.name
    const link = links.find(link => link.to === `/examples/${name}`)
    return (
      <Page title={`Examples: ${link.title}`} location={location} links={links}>
        <Title>{link.title}</Title>
        <Anchor title="Example" />
        {!error ? (
          <Example
            key={name}
            name={name}
            component={Examples[name]}
            channel={actionChannel}
          />
        ) : (
          <Error>There is something wrong with the Example</Error>
        )}
        <Anchor title="Code" />
        <Code code={code} />
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
