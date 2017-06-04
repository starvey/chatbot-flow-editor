import { Store } from '../store'
import { FlowNode } from '../classes/FlowNode'
import { NodeTypesRenderer } from './NodeTypes'

export class FlowRenderer {
  baseElement: Element
  store: Store
  elements: object= {}
  elementsBox: object = {
    h: '30px',
    w: '260px'
  }

  constructor (store: Store) {
    this.store = store
    const $svg = document.createElement('svg')
    document.querySelector('.content__main-content').appendChild($svg)
    $svg.style.width = '4000px'
    $svg.style.height = '4000px'
    $svg.style.position = "relative"
    $svg.style.display = "block"
    this.baseElement = $svg
  }

  addNode (node: FlowNode) {
    const $newNode = NodeTypesRenderer.generateElement(this.store.nodeTypes[node.flowNodeTypeSlug])
    $newNode.style.position = 'absolute'
    $newNode.style.left = `${node.x}px`
    $newNode.style.top = `${node.y}px`
    this.baseElement.appendChild($newNode)
    debugger
    this.elements[node.id] = $newNode
  }

  removeNode () {
  }
}
