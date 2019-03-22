import React from 'react'
import clipboard from 'clipboard'

import Button from './Button'

class CopyButton extends React.PureComponent {
  state = {
    text: 'copy',
  }

  handleRef = ref => (this.ref = ref)

  onSuccess = () => {
    this.clearTimer()
    this.setState({ text: 'copied' }, () => {
      this.timer = setTimeout(() => {
        this.setState({ text: 'copy' })
      }, 300)
    })
  }

  onError = () => {
    this.clearTimer()
    this.setState({ text: 'failed' }, () => {
      this.timer = setTimeout(() => {
        this.setState({ text: 'copy' })
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
    const { content } = this.props
    const { text } = this.state
    return (
      <Button ref={this.handleRef} data-clipboard-text={content}>
        {text}
      </Button>
    )
  }
}

export default CopyButton
