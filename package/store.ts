import {  FlowNode  } from './classes/FlowNode'
import {  FlowNodeType  } from './classes/FlowNodeType'

class PoolEvent {
  handlers: Array<Function> = []
  hasChanged: boolean = false
  pooledArguments: Array<any> = []
  constructor (delay = 1000/25) {
    setInterval(() => {
      if (this.hasChanged) {
        this.handlers.forEach((h) => h(this.pooledArguments))
      }
      this.hasChanged = false
    }, delay)
  }
  post (identifier?: string) {
    this.hasChanged = true
    this.pooledArguments.push(identifier)
  }
  attach (handler: Function) {
    this.handlers.push(handler)
  }
}

export class Store {
  nodeTypeRegistered: PoolEvent = new PoolEvent()
  nodeTypeUnregistered: PoolEvent = new PoolEvent()
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

  nodeRegistered: PoolEvent = new PoolEvent()
  nodeUnregistered: PoolEvent = new PoolEvent()
  nodes: Object = {}

  public registerNode (newNode: FlowNode) {
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

  positionChanged: PoolEvent = new PoolEvent()
  public position: object = null
  public setCurrentPosition (position: object) {
    this.position = position
    this.positionChanged.post()
  }

  nodeSelected: PoolEvent = new PoolEvent()
  public selectedNode: FlowNode = null
  public setSelectedNode (node: FlowNode) {
    this.selectedNode = node
    this.nodeSelected.post()
  }
  
}