import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
  margin-top: 2rem;
  border-top: 1px solid #edf0f2;
`

const StyledLink = styled(Link)`
  display: block;
  text-decoration: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #888;

  &:hover,
  &:active {
    color: #222;
  }
`

const Pagination = ({ links, link, ...rest }) => {
  const index = links.indexOf(link)
  if (index < 0) return null
  const prevLink = index === 0 ? null : links[index - 1]
  const nextLink = index === links.length - 1 ? null : links[index + 1]

  return (
    <Container {...rest}>
      <div>
        {prevLink && (
          <StyledLink to={prevLink.to}>← {prevLink.title}</StyledLink>
        )}
      </div>
      <div>
        {nextLink && (
          <StyledLink to={nextLink.to}>{nextLink.title}→ </StyledLink>
        )}
      </div>
    </Container>
  )
}

export default Pagination
