import { FlowNode } from './FlowNode'

export class FlowNodeType {
  slug: string
  name: string
  icon: string
  backgroundColor: string
  fontColor: string
  createNewInstance ({x, y}) {
    return new FlowNode({flowNodeTypeSlug: this.slug, x, y})
  }

  generateMainFormHTML (node: FlowNode) {
    return document.createElement('div')
  }

  generatePortFormHTML (node: FlowNode, linkedNode: FlowNode) {
    return document.createElement('div')
  }
}
