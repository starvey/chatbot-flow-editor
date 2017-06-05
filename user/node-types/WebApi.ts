import { FlowNodeType } from '../../package/classes/FlowNodeType'
import { FlowNode } from '../../package/classes/FlowNode'

export class WebApiNodeType extends FlowNodeType {
  slug = "web-api-node"
  name = "Web API"
  icon = "http://www.shopspringbreak.com/skin/frontend/default/theme706/fonts/general-ui/svg/message31.svg"
  backgroundColor = 'red'
  fontColor = 'black'
  createNewInstance ({x, y}) {
    return new MessageNode({
      flowNodeTypeSlug: this.slug,
      x,
      y
    })
  }
}

export class MessageNode extends FlowNode {
  message: string
}