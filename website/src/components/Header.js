import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'
import pkg from 'react-base-table/package.json'

import linkIcon from 'assets/mark-github.svg'

const Container = styled.div`
  background-color: #182a3d;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1001;
`

const Nav = styled.div`
  margin: 0 auto;
  max-width: 100rem;
  height: 5rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled(Link)`
  text-decoration: none;
  font-size: 2.4rem;
  line-height: 1;
  padding: 1rem 0;
  &,
  &:hover,
  &:focus {
    color: #fff;
  }
`

const Spacer = styled.div`
  flex: 1;
`

const NavLink = styled(Link).attrs({
  partiallyActive: true,
})`
  color: #bcc9d1;
  text-decoration: none;
  padding: 1rem;
  line-height: 1;
  &:hover {
    color: #fff;
  }
  &,
  &:focus {
    color: ${props =>
      props.pathname && props.pathname.includes(props.to) ? '#fff' : '#bcc9d1'};
  }
  &:last-child {
    padding-right: 0;
    display: inline-block;
  }
`

const ExternalLink = NavLink.withComponent('a')

const LinkIcon = styled.img`
  width: 2rem;
  height: 2rem;
`

const Version = styled(ExternalLink)`
  font-size: 1.4rem;
  padding: 1rem;
  margin-top: 1rem;
`

const Header = ({ pathname }) => {
  return (
    <Container>
      <Nav>
        <Title to="/">BaseTable</Title>
        <Version
          href="https://github.com/Autodesk/react-base-table/blob/master/CHANGELOG.md"
          target="_blank"
        >
          v{pkg.version}
        </Version>
        <Spacer />
        <NavLink to="/docs" pathname={pathname}>
          Docs
        </NavLink>
        <NavLink to="/api" pathname={pathname}>
          API
        </NavLink>
        <NavLink to="/examples" pathname={pathname}>
          Examples
        </NavLink>
        <NavLink to="/playground" pathname={pathname}>
          Playground
        </NavLink>
        <ExternalLink last href={pkg.repository.url} target="_blank">
          <LinkIcon src={linkIcon} alt="Github" />
        </ExternalLink>
      </Nav>
    </Container>
  )
}

export default Header
