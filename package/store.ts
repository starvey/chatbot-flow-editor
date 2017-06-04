import {  FlowNode  } from './classes/FlowNode'

class SyncEvent {
  handlers: Array<Function> = []
  post (identifier: string) {
    this.handlers.forEach((h) => h(identifier))
  }
  attach (handler: Function) {
    this.handlers.push(handler)
  }
}

export class Store {
  nodeTypeRegistered: SyncEvent = new SyncEvent()
  nodeTypeUnregistered: SyncEvent = new SyncEvent()
  nodeTypes: Object = {}

  public registerNodeType (newNodeType: FlowNode) {
      if (this.nodeTypes[newNodeType.slug]) {
        return Promise.reject('Another node type was registered using this slug')
      }
      this.nodeTypes[newNodeType.slug] = newNodeType
      this.nodeTypeRegistered.post(newNodeType.slug)
      return Promise.resolve(newNodeType)
  }

  public unregisterNodeType (nodeTypeSlug: string) {
      if (!this.nodeTypes[nodeTypeSlug]) {
        return Promise.reject('No node types associated with slug')
      }
      delete this.nodeTypes[nodeTypeSlug]
      this.nodeTypeUnregistered.post(nodeTypeSlug)
      return Promise.resolve()
  }
  
}