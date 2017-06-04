import { Store } from '../store'
import {FlowNodeType} from '../classes/FlowNodeType'

export class NodeTypesRenderer {
  baseElement: Element
  store: Store
  constructor (store) {
    this.store = store
    this.baseElement = document.querySelector('.side-bar__node-types')
  }

  static generateElement(nodeType: FlowNodeType) {
    const $newNode = document.createElement('div')
    $newNode.innerHTML = `
      <img class="node-types__node-type__icon" src="${nodeType.icon}" />${nodeType.name}
    `

    $newNode.className = `node-types__node-type node-type__${nodeType.slug}`
    $newNode.style.backgroundColor = nodeType.backgroundColor
    $newNode.style.color = nodeType.fontColor

    return $newNode
  }

  addNodeType (nodeType: FlowNodeType) {
    const $newNode = NodeTypesRenderer.generateElement(nodeType)

    this.baseElement.appendChild($newNode)
  }

  removeNodeType () {
  }
}
