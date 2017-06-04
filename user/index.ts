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


window['addPathForLol'] = function () {
  const $path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  $path.setAttributeNS(null, "d", "M100,100 L150,150")
  $path.setAttributeNS(null, 'stroke-width', '5')
  document.querySelector('svg').appendChild($path)
}