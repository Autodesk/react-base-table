import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

import Page from 'components/Page'

const Container = styled(Page).attrs({ full: true })`
  padding: 0;
`

const Hero = styled.div`
  background-color: #182a3d;
  color: #fff;
  padding: 100px;
  text-align: center;
`

const Title = styled.h1`
  font-size: 24px;
`

const Description = styled.p`
  font-size: 16px;
  color: #bcc9d1;
  max-width: 600px;
  margin: 20px auto 40px;
`

const Content = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 20px;
  position: relative;
`

const StyledLink = styled(Link)`
  display: block;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 500;
`

const ExternalLink = StyledLink.withComponent('a')

const StartLink = styled(Link)`
  background-color: #0696d7;
  color: #fff;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  &:hover {
    background-color: #fff;
  }
`

const ExampleLink = styled(StartLink)`
  background-color: transparent;
  &:hover {
    background-color: transparent;
  }
`

export default () => (
  <Container title="Home">
    <Hero>
      <Title>BaseTable</Title>
      <Description>
        BaseTable is a react table component to display large data set with high
        performance and flexibility
      </Description>
      <StartLink to="/docs">Get Started</StartLink>
      <ExampleLink to="/examples">View Examples</ExampleLink>
    </Hero>
    <Content>
      <StyledLink to="/docs">Docs</StyledLink>
      <StyledLink to="/api">API</StyledLink>
      <StyledLink to="/examples">Examples</StyledLink>
      <ExternalLink
        href="https://autodesk.github.io/react-base-table/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Github
      </ExternalLink>
    </Content>
  </Container>
)
