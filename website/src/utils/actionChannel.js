import EventEmitter from './eventEmitter'

export const actionEmitter = new EventEmitter()

export default class ActionChannel {
  constructor(type) {
    if (!type) throw new Error('"type" is required for ActionChannel')
    this.type = type
  }

  on(handler) {
    actionEmitter.on(this.type, handler)
  }

  off(handler) {
    actionEmitter.off(this.type, handler)
  }

  emit(event) {
    actionEmitter.emit(this.type, event)
  }
}

export const createAction = context => {
  const type = context.substr(context.lastIndexOf('/') + 1).replace('.js', '')
  return name => args => actionEmitter.emit(type, { name, args })
}
