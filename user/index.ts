import { Platform } from '../package/index'
import { MessageNodeType, MessageNode } from './node-types/Message'

const platform: Platform = new Platform()
platform.store.registerNodeType(new MessageNodeType())

platform.store.registerNode(new MessageNode({
  flowNodeTypeSlug: 'message-node',
  x: 10,
  y: 20
}))

platform.store.registerNode(new MessageNode({
  flowNodeTypeSlug: 'message-node',
  x: 500,
  y: 20
}))
