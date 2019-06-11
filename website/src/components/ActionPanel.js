import React from 'react'
import styled from 'styled-components'
import Inspector from 'react-inspector'

import CornerButton from './CornerButton'

const Container = styled.div`
  position: relative;
  outline: 1px solid #edf0f2;
  padding: 15px 0;
`

const ActionsContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  padding: 0 15px;
`

const ClearButton = styled(CornerButton)`
  background-color: transparent;
`

class ActionPanel extends React.Component {
  constructor(props) {
    super(props)
    this.props.channel.on(this.onAction)
  }

  state = {
    actions: [],
  }

  componentWillUnmount() {
    this.props.channel.off(this.onAction)
  }

  render() {
    const { actions } = this.state
    if (!actions.length) return null
    return (
      <Container>
        <ActionsContainer>
          {actions.map((action, idx) => (
            <Inspector
              key={`${action.name}-${actions.length - idx}`}
              showNonenumerable={false}
              name={action.name}
              data={action.args}
            />
          ))}
        </ActionsContainer>
        <ClearButton onClick={this.onClear}>clear</ClearButton>
      </Container>
    )
  }

  onAction = action => {
    this.setState(({ actions }) => ({
      actions: [action, ...actions.slice(0, 99)],
    }))
  }

  onClear = () => {
    this.setState({
      actions: [],
    })
  }
}

export default ActionPanel
