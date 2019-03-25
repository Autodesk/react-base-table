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
  max-width: 960px;
  height: 50px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled(Link)`
  text-decoration: none;
  font-size: 24px;
  padding: 10px 0;
  &,
  &:hover,
  &:focus {
    color: #fff;
  }
`

const NavLink = styled(Link).attrs({
  partiallyActive: true,
})`
  color: #bcc9d1;
  text-decoration: none;
  font-size: 16px;
  line-height: 20px;
  padding: 10px;
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
  width: 20px;
  height: 20px;
`

const Version = styled(ExternalLink)`
  font-size: 14px;
`

const Header = ({ pathname }) => {
  return (
    <Container>
      <Nav>
        <div>
          <Title to="/">BaseTable</Title>
          <Version
            href="https://github.com/Autodesk/react-base-table/releases"
            target="_blank"
          >
            v{pkg.version}
          </Version>
        </div>
        <div>
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
          <ExternalLink
            href="https://github.com/Autodesk/react-base-table/blob/master/CHANGELOG.md"
            target="_blank"
          >
            CHANGELOG
          </ExternalLink>
          <ExternalLink last href={pkg.repository.url} target="_blank">
            <LinkIcon src={linkIcon} alt="Github" />
          </ExternalLink>
        </div>
      </Nav>
    </Container>
  )
}

export default Header
