import { FlowNodeType } from '../../package/classes/FlowNodeType'
import { FlowNode } from '../../package/classes/FlowNode'

export class MessageNodeType extends FlowNodeType {
  slug = "message-node"
  name = "Message"
  icon = "http://www.shopspringbreak.com/skin/frontend/default/theme706/fonts/general-ui/svg/message31.svg"
  backgroundColor = 'rgba(222, 231, 231, 1)'
  fontColor = 'rgba(83, 86, 87, 1)'
  createNewInstance ({x, y}) {
    return new MessageNode({
      flowNodeTypeSlug: this.slug,
      x,
      y
    })
  }
}

export class MessageNode extends FlowNode {
  f__message: string
}