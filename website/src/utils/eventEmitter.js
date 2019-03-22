export default class EventEmitter {
  handlersMap = {}

  on(type, handler) {
    const handlers = this.handlersMap[type]
    if (!handlers) this.handlersMap[type] = [handler]
    else handlers.push(handler)
  }

  off(type, handler) {
    const handlers = this.handlersMap[type] || []
    const index = handlers.indexOf(handler)
    if (index >= 0) handlers.splice(index, 1)
  }

  emit(type, event) {
    const handlers = this.handlersMap[type] || []
    handlers.forEach(handler => handler(event))
  }
}
