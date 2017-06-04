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
}
