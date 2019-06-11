import React from 'react'
import clipboard from 'clipboard'

import CornerButton from './CornerButton'

class CopyButton extends React.PureComponent {
  state = {
    text: this.props.text,
  }

  handleRef = ref => (this.ref = ref)

  onSuccess = () => {
    this.clearTimer()
    this.setState({ text: 'copied' }, () => {
      this.timer = setTimeout(() => {
        this.setState({ text: this.props.text })
      }, 300)
    })
  }

  onError = () => {
    this.clearTimer()
    this.setState({ text: 'failed' }, () => {
      this.timer = setTimeout(() => {
        this.setState({ text: this.props.text })
      }, 300)
    })
  }

  clearTimer = () => {
    this.timer && clearTimeout(this.timer)
  }

  componentDidMount() {
    this.clearTimer()
    this.clipboard = new clipboard(this.ref)

    this.clipboard.on('success', this.onSuccess)
    this.clipboard.on('error', this.onError)
  }

  componentWillUnmount() {
    this.clipboard && this.clipboard.destroy()
  }

  render() {
    const { content, ...rest } = this.props
    const { text } = this.state
    return (
      <CornerButton
        ref={this.handleRef}
        data-clipboard-text={content}
        {...rest}
      >
        {text}
      </CornerButton>
    )
  }
}

CopyButton.defaultProps = {
  text: 'copy',
}

export default CopyButton
