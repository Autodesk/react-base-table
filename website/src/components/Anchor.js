import React from 'react'
import styled from 'styled-components'
import slugify from 'slugify'

const Container = styled.div`
  position: relative;
`

const Span = styled.span`
  display: block;
  height: 70px;
  margin-top: -70px;
  visibility: hidden;
`

const Link = styled.a`
  position: absolute;
  left: -1.6rem;

  &::before {
    content: '#';
    visibility: hidden;
  }

  &:hover {
    &::before {
      visibility: visible;
    }
  }
`

const Anchor = ({ tagName = 'h2', children, title, link, ...rest }) => {
  if (!title && !children) return null

  const slug = link || slugify(title || children, { lower: true })
  return (
    <Container as={tagName} id={slug} {...rest}>
      <Span />
      <Link href={`#${slug}`} aria-hidden="true" />
      {children || title}
    </Container>
  )
}

export default Anchor
