import { Store } from './store'
import { addNodeType } from './renderers/NodeTypes'

export class Platform {
  store: Store
  constructor () {
    this.store = new Store()
    this.store.nodeTypeRegistered.attach((slug) => {
      addNodeType(this.store.nodeTypes[slug])
    })
  }
}