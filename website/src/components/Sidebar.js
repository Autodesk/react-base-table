import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'

import linkIcon from 'assets/external-url.svg'

const Container = styled.div`
  position: fixed;
  top: 7rem;
  bottom: 2rem;
  overflow-y: auto;
  width: 22rem;
  min-width: 22rem;
  padding-right: 2rem;
  border-right: 1px solid #edf0f2;
`

const Ul = styled.ul`
  padding-top: 1rem;
`

const Li = styled.li`
  padding-bottom: 1rem;
`

const StyledLink = styled(Link).attrs({
  activeStyle: {
    fontWeight: 700,
    borderRight: '3px solid #0696d7',
  },
})`
  display: block;
  text-decoration: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #222;
`

const ExternalLink = StyledLink.withComponent('a')

const LinkIcon = styled.img`
  width: 1.4rem;
  height: 1.4rem;
  margin-left: 0.4rem;
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
