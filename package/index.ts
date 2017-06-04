import { Store } from './store'
import { NodeTypesRenderer } from './renderers/NodeTypes'
import { FlowRenderer } from './renderers/Flow'

export class Platform {
  store: Store
  constructor () {
    this.store = new Store()
    const nodeTypesRenderer = new NodeTypesRenderer(this.store)
    const flowRenderer = new FlowRenderer(this.store)
    this.store.nodeTypeRegistered.attach((slug) => {
      nodeTypesRenderer.addNodeType(this.store.nodeTypes[slug])
    })
    this.store.nodeRegistered.attach((id) => {
      flowRenderer.addNode(this.store.nodes[id])
    })
  }
}