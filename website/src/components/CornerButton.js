import styled from 'styled-components'

const CornerButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  border-bottom-left-radius: 3px;
  padding: 2px 8px;
  outline: none;
  border: 0;
  opacity: 0.5;
  font-size: 13px;
  color: #000;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`

export default CornerButton
