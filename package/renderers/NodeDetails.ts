import { Store } from '../store'
import { FlowNode } from '../classes/FlowNode'
import { FlowNodeType } from '../classes/FlowNodeType'

export class NodeDetailsRenderer {
  baseElement: Element
  htmlElement: Element
  store: Store
  constructor (store) {
    this.store = store
    this.baseElement = document.querySelector('.node-details')
    this.htmlElement = document.querySelector('html')
    this.hide()
  }

  generateHtml(nodeType: FlowNodeType, node: FlowNode) {
    let html = `
      <div class="node-details__name node-details__section-header">${node.name || nodeType.name}</div>
      <div class="node-details__main-form"></div>
    `

    if (Object.keys(node.ports).length > 0) {
      html += `
        <div class="node-details__ports">
          <div class="node-details__section-header">Ports</div>
        </div>
      `
    }

    const element = document.createElement('div')
    element.innerHTML = html

    element.querySelector('.node-details__main-form').appendChild(this.generateMainFormHTML(nodeType, node))

    if (Object.keys(node.ports).length > 0) {
      element.querySelector('.node-details__ports').appendChild(this.generatePortsFormHTML(nodeType, node))
    }

    return element
  }

  generateMainFormHTML(nodeType: FlowNodeType, node: FlowNode) {
    const element = document.createElement('div')
    element.appendChild(nodeType.generateMainFormHTML(node))
    return element
  }

  generatePortsFormHTML(nodeType: FlowNodeType, node: FlowNode) {
    const rootElement = document.createElement('div')

    Object.keys(node.ports).forEach((portId) => {
      const port = node.ports[portId]
      const linkedNode = this.store.nodes[port.linksTo]
      const linkedNodeType = this.store.nodeTypes[linkedNode.flowNodeTypeSlug]
      const element = document.createElement('div')
      element.innerHTML = `
        <div class="node-details__ports__port">
          <div class="node-details__ports__port__name">${linkedNode.name || linkedNodeType.name}</div>
          <div class="node-details__ports__port__form">
          </div>
        </div>
      `
      element.querySelector('.node-details__ports__port__form').appendChild(nodeType.generatePortFormHTML(node, linkedNode))
      rootElement.appendChild(element)
    })

    return rootElement
  }

  show () {
    this.baseElement.innerHTML = ''
    const node = this.store.selectedNode
    const nodeType = this.store.nodeTypes[node.flowNodeTypeSlug]
    this.baseElement.appendChild(this.generateHtml(nodeType, this.store.selectedNode))
    this.htmlElement.classList.add('--node-details-expanded')
  }

  hide () {
    this.htmlElement.classList.remove('--node-details-expanded')
    this.baseElement.innerHTML = ''
  }
}
