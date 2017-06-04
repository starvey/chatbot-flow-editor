import { Store } from './store'
import { NodeTypesRenderer } from './renderers/NodeTypes'
import { FlowRenderer } from './renderers/Flow'

export class Platform {
  store: Store
  constructor () {
    this.store = new Store()
    const nodeTypesRenderer = new NodeTypesRenderer(this.store)
    const flowRenderer = new FlowRenderer(this.store)
    this.store.nodeTypeRegistered.attach((pooledSlugs) => {
      pooledSlugs.forEach((slug) => nodeTypesRenderer.addNodeType(this.store.nodeTypes[slug]))
    })
    this.store.nodeRegistered.attach((id) => {
      const nodes = Object.keys(this.store.nodes).map(k => this.store.nodes[k])
      flowRenderer.addNodes(nodes)
    })
    this.store.positionChanged.attach(() => {
      if (this.store.position !== null) {
        nodeTypesRenderer.expand()
      } else {
        nodeTypesRenderer.collapse()
      }
    })
  }
}