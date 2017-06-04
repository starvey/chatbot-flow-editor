import {  FlowNode  } from './classes/FlowNode'
import {  FlowNodeType  } from './classes/FlowNodeType'

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

  public registerNodeType (newNodeType: FlowNodeType) {
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

  nodeRegistered: SyncEvent = new SyncEvent()
  nodeUnregistered: SyncEvent = new SyncEvent()
  nodes: Object = {}

  public registerNode (newNode: FlowNode) {
    if (this.nodeTypes[newNode.id]) {
      return Promise.reject('Another node was registered using this id')
    }
    this.nodes[newNode.id] = newNode
    this.nodeRegistered.post(newNode.id)
    return Promise.resolve(newNode)
  }

  public unregisterNode (nodeId: string) {
    if (!this.nodeTypes[nodeId]) {
      return Promise.reject('No node associated with id')
    }
    delete this.nodes[nodeId]
    this.nodeUnregistered.post(nodeId)
    return Promise.resolve()
  }
  
}