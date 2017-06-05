import { FlowPort } from './FlowPort'

export class FlowNode {
  id: string
  flowNodeTypeSlug: string
  x: number
  y: number
  name: string
  ports: object = {}

  constructor ({flowNodeTypeSlug, x, y}) {
    this.id = guid()
    this.flowNodeTypeSlug = flowNodeTypeSlug
    this.x = x
    this.y = y
  }
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}