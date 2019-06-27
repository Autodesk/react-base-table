import EventEmitter from './eventEmitter'

export const actionEmitter = new EventEmitter()

export default class ActionChannel {
  constructor(channel) {
    if (!channel) throw new Error('"channel" is required for ActionChannel')
    this.channel = channel
  }

  on(handler) {
    actionEmitter.on(this.channel, handler)
  }

  off(handler) {
    actionEmitter.off(this.channel, handler)
  }

  emit(event) {
    actionEmitter.emit(this.channel, event)
  }
}

export const createAction = channel => {
  return name => args => actionEmitter.emit(channel, { name, args })
}

let sequence = 0
export const createActionChannel = name => {
  const channel = name || `${Date.now()}-${sequence++}`
  return {
    action: createAction(channel),
    channel: new ActionChannel(channel),
  }
}
