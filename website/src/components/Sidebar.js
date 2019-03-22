import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'

import linkIcon from 'assets/external-url.svg'

const Container = styled.div`
  position: fixed;
  top: 70px;
  bottom: 20px;
  overflow-y: auto;
  width: 180px;
  min-width: 180px;
  padding-right: 20px;
  border-right: 1px solid #edf0f2;
`

const Ul = styled.ul`
  list-style: none;
  padding-left: 0;
`

const Li = styled.li`
  margin-bottom: 10px;
`

const StyledLink = styled(Link).attrs({
  activeStyle: {
    borderRight: '3px solid',
  },
})`
  display: block;
  text-decoration: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
`

const ExternalLink = StyledLink.withComponent('a')

const LinkIcon = styled.img`
  width: 14px;
  height: 14px;
  margin-left: 4px;
`

const Sidebar = ({ links }) => (
  <Container>
    <Ul>
      {links.map(({ key, to, title, external }) => (
        <Li key={key}>
          {external ? (
            <ExternalLink href={to} target="_blank">
              {title}
              <LinkIcon src={linkIcon} alt={title} />
            </ExternalLink>
          ) : (
            <StyledLink to={to}>{title}</StyledLink>
          )}
        </Li>
      ))}
    </Ul>
  </Container>
)

export default Sidebar
