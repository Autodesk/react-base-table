import styled from 'styled-components'

const CornerButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  border-bottom-left-radius: 0.3em;
  padding: 0.2em 0.8em;
  outline: none;
  border: 0;
  opacity: 0.5;
  font-size: 1.4rem;
  color: #000;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`

export default CornerButton
