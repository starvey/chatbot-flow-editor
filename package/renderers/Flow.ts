import { Store } from '../store'
import { FlowNode } from '../classes/FlowNode'

export class FlowRenderer {
  baseElement: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  store: Store
  elements: object= {}
  elementsBox: object = {
    h: 30,
    w: 260
  }

  constructor (store: Store) {
    this.store = store
    const $canvas = document.createElement('canvas')
    document.querySelector('.content__main-content').appendChild($canvas)
    $canvas.width = 4000
    $canvas.height = 4000
    $canvas.setAttribute('id', 'content-canvas')
    this.baseElement = $canvas
    this.ctx = $canvas.getContext('2d')
  }

  addNode (node: FlowNode) {
    const rect = this.ctx.strokeRect(node.x, node.y, this.elementsBox['w'], this.elementsBox['h'])
    console.log(rect)
  }

  removeNode () {
  }
}
