import styled from 'styled-components'

const Button = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  border-bottom-left-radius: 3px;
  padding: 4px 8px;
  outline: none;
  border: 0;
  opacity: 0.5;
  font-size: 13px;
  color: #000;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
`

export default Button
